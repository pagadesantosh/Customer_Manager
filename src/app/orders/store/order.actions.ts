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

// Create Order Actions
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

// Update Order Actions
export const updateOrder = createAction(
  '[Order] Update Order',
  props<{ orderId: number; order: Partial<Order> }>()
);

export const updateOrderSuccess = createAction(
  '[Order] Update Order Success',
  props<{ order: Order }>()
);

export const updateOrderFailure = createAction(
  '[Order] Update Order Failure',
  props<{ error: string }>()
);

// Cancel Order Actions
export const cancelOrder = createAction(
  '[Order] Cancel Order',
  props<{ orderId: number }>()
);

export const cancelOrderSuccess = createAction(
  '[Order] Cancel Order Success',
  props<{ order: Order }>()
);

export const cancelOrderFailure = createAction(
  '[Order] Cancel Order Failure',
  props<{ error: string }>()
);

// Filter Actions
export const updateFilters = createAction(
  '[Order] Update Filters',
  props<{ filters: Partial<OrderFilters> }>()
);

export const clearFilters = createAction('[Order] Clear Filters');

export const applyFilters = createAction('[Order] Apply Filters');

// View Mode Actions
export const setViewMode = createAction(
  '[Order] Set View Mode',
  props<{ viewMode: OrderViewMode }>()
);

// Selection Actions
export const selectOrder = createAction(
  '[Order] Select Order',
  props<{ order: Order | null }>()
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

// Clear Actions
export const clearOrders = createAction('[Order] Clear Orders');

export const clearError = createAction('[Order] Clear Error');
