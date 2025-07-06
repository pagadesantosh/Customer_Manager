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

// Filter options selectors
export const selectAvailableStates = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.availableStates
);

export const selectAvailableCompanies = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.availableCompanies
);

export const selectAvailableStatuses = createSelector(
  selectCustomerState,
  () => ['active', 'inactive', 'pending']
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

// Computed selectors
export const selectCustomerStats = createSelector(
  selectAllCustomers,
  selectFilteredCustomers,
  (allCustomers, filteredCustomers) => ({
    total: allCustomers.length,
    filtered: filteredCustomers.length,
    active: filteredCustomers.filter(c => c.status === 'active').length,
    inactive: filteredCustomers.filter(c => c.status === 'inactive').length,
    pending: filteredCustomers.filter(c => c.status === 'pending').length,
    totalRevenue: filteredCustomers.reduce((sum, c) => sum + c.revenue, 0)
  })
);

export const selectCustomersByState = createSelector(
  selectFilteredCustomers,
  (customers) => {
    const grouped = customers.reduce((acc, customer) => {
      if (!acc[customer.state]) {
        acc[customer.state] = [];
      }
      acc[customer.state].push(customer);
      return acc;
    }, {} as Record<string, typeof customers>);
    
    return Object.entries(grouped)
      .map(([state, customers]) => ({ state, customers, count: customers.length }))
      .sort((a, b) => b.count - a.count);
  }
);
