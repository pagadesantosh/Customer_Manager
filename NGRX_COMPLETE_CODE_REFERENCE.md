# 🏗️ NgRx Complete Code Reference - Angular Customer Manager

## Table of Contents
- [1. Store Configuration](#1-store-configuration)
- [2. Customer Feature Store](#2-customer-feature-store)
- [3. Order Feature Store](#3-order-feature-store)
- [4. Components Using NgRx](#4-components-using-ngrx)
- [5. Services Integration](#5-services-integration)
- [6. Route Configuration](#6-route-configuration)
- [7. Models & Interfaces](#7-models--interfaces)
- [8. Usage Examples](#8-usage-examples)

---

## 1. Store Configuration

### `app.config.ts` - Main NgRx Setup
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { customerFeature } from './customers/store/customer.feature';
import { CustomerEffects } from './customers/store/customer.effects';
import { orderFeature } from './orders/store/order.feature';
import { OrderEffects } from './orders/store/order.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      [customerFeature.name]: customerFeature.reducer,
      [orderFeature.name]: orderFeature.reducer
    }),
    provideEffects([CustomerEffects, OrderEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
```

---

## 2. Customer Feature Store

### `customers/store/customer.state.ts` - State Interface
```typescript
import { Customer, CustomerFilters, ViewMode } from '../models';

export interface CustomerState {
  customers: Customer[];
  filteredCustomers: Customer[];
  filters: CustomerFilters;
  viewMode: ViewMode;
  selectedCustomerId: number | null;
  
  // Filter options
  availableStates: string[];
  availableCompanies: string[];
  
  // Loading states
  loading: boolean;
  loadingFilterOptions: boolean;
  
  // Error states
  error: string | null;
  filterOptionsError: string | null;
}

export const initialCustomerState: CustomerState = {
  customers: [],
  filteredCustomers: [],
  filters: {
    states: [],
    companies: [],
    statuses: [],
    searchTerm: ''
  },
  viewMode: 'card',
  selectedCustomerId: null,
  
  availableStates: [],
  availableCompanies: [],
  
  loading: false,
  loadingFilterOptions: false,
  
  error: null,
  filterOptionsError: null
};
```

### `customers/store/customer.actions.ts` - Actions
```typescript
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer, CustomerFilters, ViewMode } from '../models';

export const CustomerActions = createActionGroup({
  source: 'Customer',
  events: {
    // Load customers
    'Load Customers': emptyProps(),
    'Load Customers Success': props<{ customers: Customer[] }>(),
    'Load Customers Failure': props<{ error: string }>(),

    // Filter actions
    'Update Filters': props<{ filters: Partial<CustomerFilters> }>(),
    'Clear Filters': emptyProps(),
    'Set Search Term': props<{ searchTerm: string }>(),
    'Toggle State Filter': props<{ state: string }>(),
    'Toggle Company Filter': props<{ company: string }>(),
    'Toggle Status Filter': props<{ status: string }>(),

    // View mode actions
    'Switch View Mode': props<{ viewMode: ViewMode }>(),

    // Customer selection
    'Select Customer': props<{ customerId: number }>(),
    'Clear Selection': emptyProps(),

    // Load filter options
    'Load Filter Options': emptyProps(),
    'Load Filter Options Success': props<{ 
      states: string[], 
      companies: string[] 
    }>(),
    'Load Filter Options Failure': props<{ error: string }>(),

    // Customer CRUD operations
    'Add Customer': props<{ customer: Partial<Customer> }>(),
    'Add Customer Success': props<{ customer: Customer }>(),
    'Add Customer Failure': props<{ error: string }>(),
    
    'Update Customer': props<{ customer: Customer }>(),
    'Update Customer Success': props<{ customer: Customer }>(),
    'Update Customer Failure': props<{ error: string }>(),
    
    'Delete Customer': props<{ customerId: number }>(),
    'Delete Customer Success': props<{ customerId: number }>(),
    'Delete Customer Failure': props<{ error: string }>()
  }
});
```

### `customers/store/customer.reducer.ts` - Reducer (Complete)
```typescript
import { createReducer, on } from '@ngrx/store';
import { CustomerActions } from './customer.actions';
import { CustomerState, initialCustomerState } from './customer.state';
import { Customer } from '../models';

function applyFilters(customers: Customer[], filters: typeof initialCustomerState.filters): Customer[] {
  return customers.filter(customer => {
    // State filter
    if (filters.states.length > 0 && !filters.states.includes(customer.state)) {
      return false;
    }

    // Company filter
    if (filters.companies.length > 0 && !filters.companies.includes(customer.company)) {
      return false;
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(customer.status)) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      return (
        customer.fullName.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.company.toLowerCase().includes(searchTerm) ||
        customer.city.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
}

export const customerReducer = createReducer(
  initialCustomerState,

  // Load customers
  on(CustomerActions.loadCustomers, (state): CustomerState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.loadCustomersSuccess, (state, { customers }): CustomerState => {
    const filteredCustomers = applyFilters(customers, state.filters);
    return {
      ...state,
      customers,
      filteredCustomers,
      loading: false,
      error: null
    };
  }),

  on(CustomerActions.loadCustomersFailure, (state, { error }): CustomerState => ({
    ...state,
    loading: false,
    error
  })),

  // Update filters
  on(CustomerActions.updateFilters, (state, { filters }): CustomerState => {
    const newFilters = { ...state.filters, ...filters };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.clearFilters, (state): CustomerState => {
    const clearedFilters = {
      states: [],
      companies: [],
      statuses: [],
      searchTerm: ''
    };
    const filteredCustomers = applyFilters(state.customers, clearedFilters);
    return {
      ...state,
      filters: clearedFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.setSearchTerm, (state, { searchTerm }): CustomerState => {
    const newFilters = { ...state.filters, searchTerm };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.toggleStateFilter, (state, { state: stateToToggle }): CustomerState => {
    const currentStates = state.filters.states;
    const newStates = currentStates.includes(stateToToggle)
      ? currentStates.filter(s => s !== stateToToggle)
      : [...currentStates, stateToToggle];
    
    const newFilters = { ...state.filters, states: newStates };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.toggleCompanyFilter, (state, { company }): CustomerState => {
    const currentCompanies = state.filters.companies;
    const newCompanies = currentCompanies.includes(company)
      ? currentCompanies.filter(c => c !== company)
      : [...currentCompanies, company];
    
    const newFilters = { ...state.filters, companies: newCompanies };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.toggleStatusFilter, (state, { status }): CustomerState => {
    const currentStatuses = state.filters.statuses;
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    const newFilters = { ...state.filters, statuses: newStatuses };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  // View mode
  on(CustomerActions.switchViewMode, (state, { viewMode }): CustomerState => ({
    ...state,
    viewMode
  })),

  // Customer selection
  on(CustomerActions.selectCustomer, (state, { customerId }): CustomerState => ({
    ...state,
    selectedCustomerId: customerId
  })),

  on(CustomerActions.clearSelection, (state): CustomerState => ({
    ...state,
    selectedCustomerId: null
  })),

  // Load filter options
  on(CustomerActions.loadFilterOptions, (state): CustomerState => ({
    ...state,
    loadingFilterOptions: true,
    filterOptionsError: null
  })),

  on(CustomerActions.loadFilterOptionsSuccess, (state, { states, companies }): CustomerState => ({
    ...state,
    availableStates: states,
    availableCompanies: companies,
    loadingFilterOptions: false,
    filterOptionsError: null
  })),

  on(CustomerActions.loadFilterOptionsFailure, (state, { error }): CustomerState => ({
    ...state,
    loadingFilterOptions: false,
    filterOptionsError: error
  })),

  // Add customer
  on(CustomerActions.addCustomer, (state): CustomerState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.addCustomerSuccess, (state, { customer }): CustomerState => {
    const newCustomers = [...state.customers, customer];
    const filteredCustomers = applyFilters(newCustomers, state.filters);
    return {
      ...state,
      customers: newCustomers,
      filteredCustomers,
      loading: false,
      error: null
    };
  }),

  on(CustomerActions.addCustomerFailure, (state, { error }): CustomerState => ({
    ...state,
    loading: false,
    error
  })),

  // Update customer
  on(CustomerActions.updateCustomer, (state): CustomerState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.updateCustomerSuccess, (state, { customer }): CustomerState => {
    const newCustomers = state.customers.map(c => 
      c.id === customer.id ? customer : c
    );
    const filteredCustomers = applyFilters(newCustomers, state.filters);
    return {
      ...state,
      customers: newCustomers,
      filteredCustomers,
      loading: false,
      error: null
    };
  }),

  on(CustomerActions.updateCustomerFailure, (state, { error }): CustomerState => ({
    ...state,
    loading: false,
    error
  })),

  // Delete customer
  on(CustomerActions.deleteCustomer, (state): CustomerState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.deleteCustomerSuccess, (state, { customerId }): CustomerState => {
    const newCustomers = state.customers.filter(c => c.id !== customerId);
    const filteredCustomers = applyFilters(newCustomers, state.filters);
    return {
      ...state,
      customers: newCustomers,
      filteredCustomers,
      loading: false,
      error: null,
      selectedCustomerId: state.selectedCustomerId === customerId ? null : state.selectedCustomerId
    };
  }),

  on(CustomerActions.deleteCustomerFailure, (state, { error }): CustomerState => ({
    ...state,
    loading: false,
    error
  }))
);
```

### `customers/store/customer.selectors.ts` - Selectors (Complete)
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';

export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

// Customer selectors
export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customers
);

export const selectFilteredCustomers = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.filteredCustomers
);

export const selectCustomerById = (customerId: number) => createSelector(
  selectAllCustomers,
  (customers) => customers.find(customer => customer.id === customerId)
);

export const selectSelectedCustomer = createSelector(
  selectCustomerState,
  selectAllCustomers,
  (state: CustomerState, customers) => 
    state.selectedCustomerId ? customers.find(c => c.id === state.selectedCustomerId) : null
);

// Filter selectors
export const selectFilters = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.filters
);

export const selectActiveFiltersCount = createSelector(
  selectFilters,
  (filters) => {
    let count = 0;
    if (filters.states.length > 0) count++;
    if (filters.companies.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.searchTerm.trim()) count++;
    return count;
  }
);

// View mode selectors
export const selectViewMode = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.viewMode
);

// Loading selectors
export const selectLoading = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loading
);

export const selectLoadingFilterOptions = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loadingFilterOptions
);

// Error selectors
export const selectError = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.error
);

export const selectFilterOptionsError = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.filterOptionsError
);

// Filter options selectors
export const selectAvailableStates = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.availableStates
);

export const selectAvailableCompanies = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.availableCompanies
);

// Computed selectors
export const selectCustomerStats = createSelector(
  selectFilteredCustomers,
  (customers) => {
    const total = customers.length;
    const activeCount = customers.filter(c => c.status === 'active').length;
    const inactiveCount = customers.filter(c => c.status === 'inactive').length;
    const totalRevenue = customers.reduce((sum, customer) => sum + (customer.revenue || 0), 0);
    
    return {
      total,
      filtered: total,
      activeCount,
      inactiveCount,
      totalRevenue
    };
  }
);

export const selectCustomersByState = createSelector(
  selectFilteredCustomers,
  (customers) => {
    const stateGroups: { [state: string]: number } = {};
    customers.forEach(customer => {
      stateGroups[customer.state] = (stateGroups[customer.state] || 0) + 1;
    });
    return stateGroups;
  }
);

export const selectCustomersByCompany = createSelector(
  selectFilteredCustomers,
  (customers) => {
    const companyGroups: { [company: string]: number } = {};
    customers.forEach(customer => {
      companyGroups[customer.company] = (companyGroups[customer.company] || 0) + 1;
    });
    return companyGroups;
  }
);

export const selectHasActiveFilters = createSelector(
  selectActiveFiltersCount,
  (count) => count > 0
);

export const selectIsCustomerSelected = createSelector(
  selectCustomerState,
  (state) => state.selectedCustomerId !== null
);
```

### `customers/store/customer.effects.ts` - Effects (Complete)
```typescript
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { CustomerApiService } from '../services/customer-api.service';
import { CustomerActions } from './customer.actions';

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private customerApiService = inject(CustomerApiService);

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(() =>
        this.customerApiService.getCustomers().pipe(
          map(customers => CustomerActions.loadCustomersSuccess({ customers })),
          catchError(error => of(CustomerActions.loadCustomersFailure({ 
            error: error.message || 'Failed to load customers' 
          })))
        )
      )
    )
  );

  loadFilterOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadFilterOptions),
      switchMap(() =>
        this.customerApiService.getUniqueStates().pipe(
          switchMap(states =>
            this.customerApiService.getUniqueCompanies().pipe(
              map(companies => CustomerActions.loadFilterOptionsSuccess({ 
                states, 
                companies 
              })),
              catchError(error => of(CustomerActions.loadFilterOptionsFailure({ 
                error: error.message || 'Failed to load filter options' 
              })))
            )
          ),
          catchError(error => of(CustomerActions.loadFilterOptionsFailure({ 
            error: error.message || 'Failed to load filter options' 
          })))
        )
      )
    )
  );

  addCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.addCustomer),
      mergeMap(({ customer }) =>
        this.customerApiService.addCustomer(customer).pipe(
          map(newCustomer => CustomerActions.addCustomerSuccess({ customer: newCustomer })),
          catchError(error => of(CustomerActions.addCustomerFailure({ 
            error: error.message || 'Failed to add customer' 
          })))
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      mergeMap(({ customer }) =>
        this.customerApiService.updateCustomer(customer).pipe(
          map(updatedCustomer => CustomerActions.updateCustomerSuccess({ customer: updatedCustomer })),
          catchError(error => of(CustomerActions.updateCustomerFailure({ 
            error: error.message || 'Failed to update customer' 
          })))
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      mergeMap(({ customerId }) =>
        this.customerApiService.deleteCustomer(customerId).pipe(
          map(() => CustomerActions.deleteCustomerSuccess({ customerId })),
          catchError(error => of(CustomerActions.deleteCustomerFailure({ 
            error: error.message || 'Failed to delete customer' 
          })))
        )
      )
    )
  );
}
```

### `customers/store/customer.feature.ts` - Feature Definition
```typescript
import { createFeature } from '@ngrx/store';
import { customerReducer } from './customer.reducer';

export const customerFeature = createFeature({
  name: 'customers',
  reducer: customerReducer
});

export const {
  selectCustomersState,
  selectCustomers,
  selectFilteredCustomers,
  selectFilters,
  selectViewMode,
  selectSelectedCustomerId,
  selectAvailableStates,
  selectAvailableCompanies,
  selectLoading,
  selectLoadingFilterOptions,
  selectError,
  selectFilterOptionsError
} = customerFeature;
```

### `customers/store/index.ts` - Barrel Exports
```typescript
export * from './customer.actions';
export * from './customer.state';
export * from './customer.reducer';
export * from './customer.effects';
export * from './customer.selectors';
export { customerFeature } from './customer.feature';
```

---

## 3. Order Feature Store

### `orders/store/order.state.ts` - State Interface
```typescript
import { Order, OrderFilters, OrderViewMode } from '../models';

export interface OrderState {
  orders: Order[];
  filteredOrders: Order[];
  selectedOrder: Order | null;
  customerOrders: { [customerId: number]: Order[] }; // Cache orders by customer
  filters: OrderFilters;
  viewMode: OrderViewMode;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export const initialOrderState: OrderState = {
  orders: [],
  filteredOrders: [],
  selectedOrder: null,
  customerOrders: {},
  filters: {
    statuses: [],
    dateRange: {},
    customerIds: [],
    searchTerm: '',
    minAmount: undefined,
    maxAmount: undefined
  },
  viewMode: 'card',
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  }
};
```

### `orders/store/order.actions.ts` - Actions (Complete)
```typescript
import { createAction, props } from '@ngrx/store';
import { Order, OrderFilters, OrderViewMode } from '../models';

// Load Orders Actions
export const loadOrders = createAction(
  '[Order] Load Orders',
  props<{ filters?: OrderFilters }>()
);

export const loadOrdersSuccess = createAction(
  '[Order] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const loadOrdersFailure = createAction(
  '[Order] Load Orders Failure',
  props<{ error: string }>()
);

// Load Customer Orders Actions
export const loadCustomerOrders = createAction(
  '[Order] Load Customer Orders',
  props<{ customerId: number }>()
);

export const loadCustomerOrdersSuccess = createAction(
  '[Order] Load Customer Orders Success',
  props<{ customerId: number; orders: Order[] }>()
);

export const loadCustomerOrdersFailure = createAction(
  '[Order] Load Customer Orders Failure',
  props<{ error: string }>()
);

// Load Single Order Actions
export const loadOrder = createAction(
  '[Order] Load Order',
  props<{ orderId: number }>()
);

export const loadOrderSuccess = createAction(
  '[Order] Load Order Success',
  props<{ order: Order }>()
);

export const loadOrderFailure = createAction(
  '[Order] Load Order Failure',
  props<{ error: string }>()
);

// Filter Actions
export const updateFilters = createAction(
  '[Order] Update Filters',
  props<{ filters: Partial<OrderFilters> }>()
);

export const clearFilters = createAction(
  '[Order] Clear Filters'
);

export const setSearchTerm = createAction(
  '[Order] Set Search Term',
  props<{ searchTerm: string }>()
);

export const toggleStatusFilter = createAction(
  '[Order] Toggle Status Filter',
  props<{ status: string }>()
);

export const setDateRange = createAction(
  '[Order] Set Date Range',
  props<{ dateRange: { start?: Date; end?: Date } }>()
);

export const setAmountRange = createAction(
  '[Order] Set Amount Range',
  props<{ minAmount?: number; maxAmount?: number }>()
);

// View Mode Actions
export const setViewMode = createAction(
  '[Order] Set View Mode',
  props<{ viewMode: OrderViewMode }>()
);

// Selection Actions
export const selectOrder = createAction(
  '[Order] Select Order',
  props<{ order: Order }>()
);

export const clearSelection = createAction(
  '[Order] Clear Selection'
);

// Pagination Actions
export const setPage = createAction(
  '[Order] Set Page',
  props<{ page: number }>()
);

export const setPageSize = createAction(
  '[Order] Set Page Size',
  props<{ pageSize: number }>()
);

// Order Operations
export const createOrder = createAction(
  '[Order] Create Order',
  props<{ order: Partial<Order> }>()
);

export const createOrderSuccess = createAction(
  '[Order] Create Order Success',
  props<{ order: Order }>()
);

export const createOrderFailure = createAction(
  '[Order] Create Order Failure',
  props<{ error: string }>()
);

export const updateOrder = createAction(
  '[Order] Update Order',
  props<{ order: Order }>()
);

export const updateOrderSuccess = createAction(
  '[Order] Update Order Success',
  props<{ order: Order }>()
);

export const updateOrderFailure = createAction(
  '[Order] Update Order Failure',
  props<{ error: string }>()
);

export const cancelOrder = createAction(
  '[Order] Cancel Order',
  props<{ orderId: number }>()
);

export const cancelOrderSuccess = createAction(
  '[Order] Cancel Order Success',
  props<{ orderId: number }>()
);

export const cancelOrderFailure = createAction(
  '[Order] Cancel Order Failure',
  props<{ error: string }>()
);

export const deleteOrder = createAction(
  '[Order] Delete Order',
  props<{ orderId: number }>()
);

export const deleteOrderSuccess = createAction(
  '[Order] Delete Order Success',
  props<{ orderId: number }>()
);

export const deleteOrderFailure = createAction(
  '[Order] Delete Order Failure',
  props<{ error: string }>()
);

// Error Actions
export const clearError = createAction(
  '[Order] Clear Error'
);
```

### `orders/store/order.selectors.ts` - Selectors (Complete)
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.state';
import { OrderFilters } from '../models';

export const selectOrderState = createFeatureSelector<OrderState>('orders');

// Basic selectors
export const selectAllOrders = createSelector(
  selectOrderState,
  (state: OrderState) => state.orders
);

export const selectFilteredOrders = createSelector(
  selectOrderState,
  (state: OrderState) => state.filteredOrders
);

export const selectSelectedOrder = createSelector(
  selectOrderState,
  (state: OrderState) => state.selectedOrder
);

export const selectOrderFilters = createSelector(
  selectOrderState,
  (state: OrderState) => state.filters
);

export const selectOrderViewMode = createSelector(
  selectOrderState,
  (state: OrderState) => state.viewMode
);

export const selectOrderLoading = createSelector(
  selectOrderState,
  (state: OrderState) => state.loading
);

export const selectOrderError = createSelector(
  selectOrderState,
  (state: OrderState) => state.error
);

export const selectOrderPagination = createSelector(
  selectOrderState,
  (state: OrderState) => state.pagination
);

export const selectCustomerOrders = createSelector(
  selectOrderState,
  (state: OrderState) => state.customerOrders
);

// Pagination selectors
export const selectCurrentPage = createSelector(
  selectOrderState,
  (state: OrderState) => state.pagination.currentPage
);

export const selectPageSize = createSelector(
  selectOrderState,
  (state: OrderState) => state.pagination.pageSize
);

export const selectTotalItems = createSelector(
  selectOrderState,
  (state: OrderState) => state.pagination.totalItems
);

export const selectTotalPages = createSelector(
  selectOrderState,
  (state: OrderState) => state.pagination.totalPages
);

export const selectCurrentPageInfo = createSelector(
  selectOrderState,
  (state: OrderState) => ({
    currentPage: state.pagination.currentPage,
    pageSize: state.pagination.pageSize,
    totalItems: state.pagination.totalItems,
    totalPages: state.pagination.totalPages,
    hasNextPage: state.pagination.currentPage < state.pagination.totalPages,
    hasPreviousPage: state.pagination.currentPage > 1,
    startIndex: (state.pagination.currentPage - 1) * state.pagination.pageSize + 1,
    endIndex: Math.min(state.pagination.currentPage * state.pagination.pageSize, state.pagination.totalItems)
  })
);

// Computed selectors
export const selectPaginatedOrders = createSelector(
  selectFilteredOrders,
  selectOrderState,
  (orders, state) => {
    const startIndex = (state.pagination.currentPage - 1) * state.pagination.pageSize;
    const endIndex = startIndex + state.pagination.pageSize;
    return orders.slice(startIndex, endIndex);
  }
);

export const selectOrderStats = createSelector(
  selectFilteredOrders,
  (orders) => {
    const total = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = total > 0 ? totalRevenue / total : 0;
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as { [status: string]: number });
    
    return {
      total,
      totalRevenue,
      averageOrderValue,
      statusCounts
    };
  }
);

export const selectHasActiveFilters = createSelector(
  selectOrderFilters,
  (filters: OrderFilters) => {
    return filters.statuses.length > 0 ||
           filters.customerIds.length > 0 ||
           filters.searchTerm.trim() !== '' ||
           filters.minAmount !== undefined ||
           filters.maxAmount !== undefined ||
           Object.keys(filters.dateRange).length > 0;
  }
);

export const selectOrdersByStatus = createSelector(
  selectFilteredOrders,
  (orders) => {
    const statusGroups: { [status: string]: number } = {};
    orders.forEach(order => {
      statusGroups[order.status] = (statusGroups[order.status] || 0) + 1;
    });
    return statusGroups;
  }
);

export const selectOrdersByCustomer = createSelector(
  selectFilteredOrders,
  (orders) => {
    const customerGroups: { [customerId: number]: number } = {};
    orders.forEach(order => {
      customerGroups[order.customerId] = (customerGroups[order.customerId] || 0) + 1;
    });
    return customerGroups;
  }
);

export const selectOrderById = (orderId: number) => createSelector(
  selectAllOrders,
  (orders) => orders.find(order => order.id === orderId)
);

export const selectCustomerOrdersById = (customerId: number) => createSelector(
  selectCustomerOrders,
  (customerOrders) => customerOrders[customerId] || []
);
```

### `orders/store/order.feature.ts` - Feature Definition
```typescript
import { createFeature } from '@ngrx/store';
import { orderReducer } from './order.reducer';

export const orderFeature = createFeature({
  name: 'orders',
  reducer: orderReducer
});
```

### `orders/store/index.ts` - Barrel Exports
```typescript
export * from './order.state';
export * from './order.actions';
export * from './order.reducer';
export * from './order.selectors';
export * from './order.effects';
export * from './order.feature';
```

---

## 4. Components Using NgRx

### `customers/components/customer-container.component.ts` - Main Container (Key Parts)
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, map } from 'rxjs';
import { Customer, CustomerFilters, ViewMode } from '../models';
import { CustomerActions } from '../store';
import * as CustomerSelectors from '../store/customer.selectors';

@Component({
  selector: 'app-customer-container',
  // ... template and styles
})
export class CustomerContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private store = inject(Store);

  // Observable streams
  filteredCustomers$: Observable<Customer[]>;
  currentFilters$: Observable<CustomerFilters>;
  viewMode$: Observable<ViewMode>;
  selectedCustomerId$: Observable<number | null>;
  availableStates$: Observable<string[]>;
  availableCompanies$: Observable<string[]>;
  loading$: Observable<boolean>;
  loadingFilterOptions$: Observable<boolean>;
  error$: Observable<string | null>;
  customerStats$: Observable<any>;

  constructor(private store: Store, private customerModalService: CustomerModalService) {
    // Initialize observables
    this.filteredCustomers$ = this.store.select(CustomerSelectors.selectFilteredCustomers);
    this.currentFilters$ = this.store.select(CustomerSelectors.selectFilters);
    this.viewMode$ = this.store.select(CustomerSelectors.selectViewMode);
    this.selectedCustomerId$ = this.store.select(CustomerSelectors.selectCustomerState).pipe(
      map(state => state.selectedCustomerId),
      takeUntil(this.destroy$)
    );
    this.availableStates$ = this.store.select(CustomerSelectors.selectAvailableStates);
    this.availableCompanies$ = this.store.select(CustomerSelectors.selectAvailableCompanies);
    this.loading$ = this.store.select(CustomerSelectors.selectLoading);
    this.loadingFilterOptions$ = this.store.select(CustomerSelectors.selectLoadingFilterOptions);
    this.error$ = this.store.select(CustomerSelectors.selectError);
    this.customerStats$ = this.store.select(CustomerSelectors.selectCustomerStats);
  }

  ngOnInit(): void {
    // Load initial data
    this.store.dispatch(CustomerActions.loadCustomers());
    this.store.dispatch(CustomerActions.loadFilterOptions());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers
  onViewModeChange(viewMode: ViewMode): void {
    this.store.dispatch(CustomerActions.switchViewMode({ viewMode }));
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.dispatch(CustomerActions.setSearchTerm({ searchTerm }));
  }

  onStateToggle(state: string): void {
    this.store.dispatch(CustomerActions.toggleStateFilter({ state }));
  }

  onCompanyToggle(company: string): void {
    this.store.dispatch(CustomerActions.toggleCompanyFilter({ company }));
  }

  onStatusToggle(status: string): void {
    this.store.dispatch(CustomerActions.toggleStatusFilter({ status }));
  }

  onClearFilters(): void {
    this.store.dispatch(CustomerActions.clearFilters());
  }

  onCustomerSelect(customer: Customer): void {
    this.store.dispatch(CustomerActions.selectCustomer({ customerId: customer.id }));
  }

  onViewCustomerDetails(customer: Customer): void {
    this.store.dispatch(CustomerActions.selectCustomer({ customerId: customer.id }));
    console.log('View details for customer:', customer);
  }

  onRetry(): void {
    this.store.dispatch(CustomerActions.loadCustomers());
    this.store.dispatch(CustomerActions.loadFilterOptions());
  }

  onEditCustomer(customer: Customer): void {
    this.customerModalService.openEditModal(customer);
  }
}
```

### `orders/pages/orders-page.component.ts` - Orders Page (Key Parts)
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Order, OrderFilters, OrderViewMode } from '../models';
import * as OrderActions from '../store/order.actions';
import * as OrderSelectors from '../store/order.selectors';

@Component({
  selector: 'app-orders-page',
  // ... template and styles
})
export class OrdersPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private store: Store = inject(Store);

  // Observable streams
  orders$: Observable<Order[]>;
  filteredOrders$: Observable<Order[]>;
  paginatedOrders$: Observable<Order[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filters$: Observable<OrderFilters>;
  hasActiveFilters$: Observable<boolean>;
  currentPageInfo$: Observable<any>;
  orderStats$: Observable<any>;

  constructor(private store: Store) {
    this.orders$ = this.store.select(OrderSelectors.selectAllOrders);
    this.filteredOrders$ = this.store.select(OrderSelectors.selectFilteredOrders);
    this.paginatedOrders$ = this.store.select(OrderSelectors.selectPaginatedOrders);
    this.loading$ = this.store.select(OrderSelectors.selectOrderLoading);
    this.error$ = this.store.select(OrderSelectors.selectOrderError);
    this.filters$ = this.store.select(OrderSelectors.selectOrderFilters);
    this.hasActiveFilters$ = this.store.select(OrderSelectors.selectHasActiveFilters);
    this.currentPageInfo$ = this.store.select(OrderSelectors.selectCurrentPageInfo);
    this.orderStats$ = this.store.select(OrderSelectors.selectOrderStats);
  }

  ngOnInit(): void {
    this.store.dispatch(OrderActions.loadOrders({}));
    this.store.dispatch(OrderActions.setPage({ page: 1 }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Filter methods
  onSearchChange(searchTerm: string): void {
    this.store.dispatch(OrderActions.updateFilters({ 
      filters: { searchTerm } 
    }));
    this.store.dispatch(OrderActions.loadOrders({}));
    this.store.dispatch(OrderActions.setPage({ page: 1 }));
  }

  onStatusFilterChange(statuses: string[]): void {
    this.store.dispatch(OrderActions.updateFilters({
      filters: { statuses }
    }));
  }

  onClearFilters(): void {
    this.store.dispatch(OrderActions.clearFilters());
    this.store.dispatch(OrderActions.updateFilters({
      filters: { searchTerm: '', statuses: [], customerIds: [] }
    }));
  }

  // View mode methods
  onViewModeChange(mode: OrderViewMode): void {
    this.store.dispatch(OrderActions.setViewMode({ viewMode: mode }));
  }

  // Selection methods
  onSelectOrder(order: Order): void {
    this.store.dispatch(OrderActions.selectOrder({ order }));
  }

  // Order operations
  onCancelOrder(order: Order): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.store.dispatch(OrderActions.cancelOrder({ orderId: order.id }));
    }
  }

  // Pagination methods
  onPreviousPage(): void {
    if (this.currentPageInfo.hasPreviousPage) {
      this.store.dispatch(OrderActions.setPage({ page: this.currentPageInfo.currentPage - 1 }));
    }
  }

  onNextPage(): void {
    if (this.currentPageInfo.hasNextPage) {
      this.store.dispatch(OrderActions.setPage({ page: this.currentPageInfo.currentPage + 1 }));
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.currentPageInfo.totalPages) {
      this.store.dispatch(OrderActions.setPage({ page }));
    }
  }

  onFirstPage(): void {
    this.store.dispatch(OrderActions.setPage({ page: 1 }));
  }

  onLastPage(): void {
    if (this.currentPageInfo.totalPages > 0) {
      this.store.dispatch(OrderActions.setPage({ page: this.currentPageInfo.totalPages }));
    }
  }

  onPageSizeChange(pageSize: number): void {
    this.store.dispatch(OrderActions.setPageSize({ pageSize }));
  }
}
```

### `shared/components/header.component.ts` - Header Component (Key Parts)
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, filter, takeUntil } from 'rxjs';
import { CustomerActions } from '../../customers/store';
import * as CustomerSelectors from '../../customers/store/customer.selectors';
import { Customer } from '../../customers/models';

@Component({
  selector: 'app-header',
  // ... template and styles
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private store: Store = inject(Store);

  // Component state
  currentView: ViewMode = 'card';
  showModal = false;
  selectedCustomer: Customer | null = null;
  isLoading = false;

  ngOnInit(): void {
    // Subscribe to current view mode from store
    this.store.select(CustomerSelectors.selectViewMode)
      .pipe(takeUntil(this.destroy$))
      .subscribe(viewMode => {
        this.currentView = viewMode;
      });

    // Subscribe to loading state
    this.store.select(CustomerSelectors.selectLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    // Subscribe to modal service for edit events
    this.customerModalService.editCustomer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        this.selectedCustomer = customer;
        this.showModal = true;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // View mode change handler
  setView(view: ViewMode): void {
    // Dispatch action to update view mode in store
    this.store.dispatch(CustomerActions.switchViewMode({ viewMode: view }));
  }

  // Customer operations
  onAddCustomer(): void {
    this.selectedCustomer = null;
    this.showModal = true;
  }

  onSaveCustomer(customer: Customer): void {
    if (this.selectedCustomer) {
      // Update existing customer
      this.store.dispatch(CustomerActions.updateCustomer({ 
        customer: { ...this.selectedCustomer, ...customer }
      }));
    } else {
      // Add new customer
      this.store.dispatch(CustomerActions.addCustomer({ 
        customer 
      }));
    }
    
    this.showModal = false;
    this.selectedCustomer = null;
  }

  onCloseModal(): void {
    this.showModal = false;
    this.selectedCustomer = null;
  }
}
```

---

## 5. Services Integration

### `shared/services/customer-modal.service.ts` - Modal Communication Service
```typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Customer } from '../../customers/models';

@Injectable({
  providedIn: 'root'
})
export class CustomerModalService {
  private editCustomerSubject = new Subject<Customer>();
  
  editCustomer$ = this.editCustomerSubject.asObservable();

  openEditModal(customer: Customer): void {
    this.editCustomerSubject.next(customer);
  }
}
```

### `customers/services/customer-api.service.ts` - API Service (Key Methods)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Customer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  private baseUrl = '/assets/data';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers.json`).pipe(
      catchError(error => {
        console.error('Error loading customers:', error);
        return of([]);
      })
    );
  }

  getUniqueStates(): Observable<string[]> {
    return this.getCustomers().pipe(
      map(customers => {
        const states = [...new Set(customers.map(c => c.state))];
        return states.sort();
      })
    );
  }

  getUniqueCompanies(): Observable<string[]> {
    return this.getCustomers().pipe(
      map(customers => {
        const companies = [...new Set(customers.map(c => c.company))];
        return companies.sort();
      })
    );
  }

  addCustomer(customer: Partial<Customer>): Observable<Customer> {
    // Simulate API call
    const newCustomer: Customer = {
      id: Date.now(),
      ...customer
    } as Customer;
    
    return of(newCustomer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    // Simulate API call
    return of(customer);
  }

  deleteCustomer(customerId: number): Observable<void> {
    // Simulate API call
    return of(void 0);
  }
}
```

---

## 6. Route Configuration

### `app.routes.ts` - Route Configuration
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
  },
  {
    path: 'customers',
    loadComponent: () => import('./customers/pages/customers-page.component').then(m => m.CustomersPageComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/pages/orders-page.component').then(m => m.OrdersPageComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about-page.component').then(m => m.AboutPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: '**',
    redirectTo: '/customers'
  }
];
```

---

## 7. Models & Interfaces

### `customers/models/customer.model.ts` - Customer Model
```typescript
export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  status: 'active' | 'inactive';
  revenue: number;
  lastContactDate: Date;
  notes: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CustomerFilters {
  states: string[];
  companies: string[];
  statuses: string[];
  searchTerm: string;
}

export type ViewMode = 'card' | 'list' | 'map';
```

### `orders/models/order.model.ts` - Order Model
```typescript
export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderFilters {
  statuses: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  customerIds: number[];
  searchTerm: string;
  minAmount?: number;
  maxAmount?: number;
}

export type OrderViewMode = 'card' | 'list';
```

---

## 8. Usage Examples

### Example 1: Loading Customers
```typescript
// Dispatch action to load customers
this.store.dispatch(CustomerActions.loadCustomers());

// Subscribe to loading state
this.loading$ = this.store.select(CustomerSelectors.selectLoading);

// Subscribe to customers
this.customers$ = this.store.select(CustomerSelectors.selectFilteredCustomers);
```

### Example 2: Filtering Customers
```typescript
// Update search term
this.store.dispatch(CustomerActions.setSearchTerm({ searchTerm: 'John' }));

// Toggle state filter
this.store.dispatch(CustomerActions.toggleStateFilter({ state: 'CA' }));

// Clear all filters
this.store.dispatch(CustomerActions.clearFilters());
```

### Example 3: View Mode Switching
```typescript
// Switch to map view
this.store.dispatch(CustomerActions.switchViewMode({ viewMode: 'map' }));

// Subscribe to current view mode
this.viewMode$ = this.store.select(CustomerSelectors.selectViewMode);
```

### Example 4: Order Operations
```typescript
// Load orders
this.store.dispatch(OrderActions.loadOrders({}));

// Update filters
this.store.dispatch(OrderActions.updateFilters({
  filters: { statuses: ['pending', 'processing'] }
}));

// Pagination
this.store.dispatch(OrderActions.setPage({ page: 2 }));
this.store.dispatch(OrderActions.setPageSize({ pageSize: 50 }));
```

### Example 5: Error Handling
```typescript
// Subscribe to errors
this.error$ = this.store.select(CustomerSelectors.selectError);

// Handle errors in template
<div *ngIf="error$ | async as error" class="error">
  {{ error }}
  <button (click)="onRetry()">Retry</button>
</div>
```

### Example 6: Using Computed Selectors
```typescript
// Get customer statistics
this.stats$ = this.store.select(CustomerSelectors.selectCustomerStats);

// Get active filters count
this.activeFiltersCount$ = this.store.select(CustomerSelectors.selectActiveFiltersCount);

// Check if filters are active
this.hasActiveFilters$ = this.store.select(CustomerSelectors.selectHasActiveFilters);
```

---

## 🔧 Development Tools

### Redux DevTools Configuration
```typescript
// In app.config.ts
provideStoreDevtools({
  maxAge: 25,        // Retain last 25 states
  logOnly: false,    // Allow state modification in dev
  autoPause: true,   // Auto-pause when tab not active
  trace: false,      // Include stack trace for actions
  traceLimit: 75     // Limit trace stack size
})
```

### Testing Examples
```typescript
// Testing actions
import { CustomerActions } from './customer.actions';

describe('CustomerActions', () => {
  it('should create loadCustomers action', () => {
    const action = CustomerActions.loadCustomers();
    expect(action.type).toBe('[Customer] Load Customers');
  });
});

// Testing selectors
import { selectAllCustomers } from './customer.selectors';

describe('CustomerSelectors', () => {
  it('should select all customers', () => {
    const customers = [{ id: 1, name: 'John' }];
    const state = { customers: { customers } };
    const result = selectAllCustomers(state);
    expect(result).toEqual(customers);
  });
});
```

---

## 📚 Key Concepts Summary

### 1. **Store Structure**
- **Feature-based organization**: Separate stores for customers and orders
- **Single source of truth**: All state centralized in NgRx store
- **Immutable updates**: State changes only through reducers

### 2. **Data Flow**
1. **Component** dispatches action
2. **Effect** handles side effects (API calls)
3. **Reducer** updates state immutably
4. **Selector** provides derived state
5. **Component** receives updates via observables

### 3. **Best Practices**
- Use **memoized selectors** for performance
- Implement **proper error handling** in effects
- Follow **action naming conventions**
- Use **OnPush change detection** with observables
- Implement **subscription cleanup** patterns

### 4. **Performance Optimizations**
- **Selector memoization** prevents unnecessary computations
- **OnPush change detection** reduces rendering cycles
- **Lazy loading** components for better initial load
- **Proper subscription management** prevents memory leaks

This comprehensive reference covers all NgRx implementation details in your Angular Customer Manager application! 🚀
