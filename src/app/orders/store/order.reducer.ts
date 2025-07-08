import { createReducer, on } from '@ngrx/store';
import { OrderState, initialOrderState } from './order.state';
import * as OrderActions from './order.actions';
import { Order } from '../models';

export const orderReducer = createReducer(
  initialOrderState,

  // Load Orders
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.loadOrdersSuccess, (state, { orders }) => {
    const filteredOrders = applyFiltersToOrders(orders, state.filters);
    return {
      ...state,
      orders,
      filteredOrders,
      loading: false,
      error: null,
      pagination: {
        ...state.pagination,
        totalItems: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / state.pagination.pageSize)
      }
    };
  }),

  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Customer Orders
  on(OrderActions.loadCustomerOrders, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.loadCustomerOrdersSuccess, (state, { customerId, orders }) => ({
    ...state,
    customerOrders: {
      ...state.customerOrders,
      [customerId]: orders
    },
    loading: false,
    error: null
  })),

  on(OrderActions.loadCustomerOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Single Order
  on(OrderActions.loadOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.loadOrderSuccess, (state, { order }) => {
    const updatedOrders = updateOrderInArray(state.orders, order);
    return {
      ...state,
      orders: updatedOrders,
      filteredOrders: applyFiltersToOrders(updatedOrders, state.filters),
      selectedOrder: order,
      loading: false,
      error: null
    };
  }),

  on(OrderActions.loadOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Order
  on(OrderActions.createOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.createOrderSuccess, (state, { order }) => {
    const updatedOrders = [...state.orders, order];
    return {
      ...state,
      orders: updatedOrders,
      filteredOrders: applyFiltersToOrders(updatedOrders, state.filters),
      loading: false,
      error: null,
      pagination: {
        ...state.pagination,
        totalItems: updatedOrders.length,
        totalPages: Math.ceil(updatedOrders.length / state.pagination.pageSize)
      }
    };
  }),

  on(OrderActions.createOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Order
  on(OrderActions.updateOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.updateOrderSuccess, (state, { order }) => {
    const updatedOrders = updateOrderInArray(state.orders, order);
    return {
      ...state,
      orders: updatedOrders,
      filteredOrders: applyFiltersToOrders(updatedOrders, state.filters),
      selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
      loading: false,
      error: null
    };
  }),

  on(OrderActions.updateOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Cancel Order
  on(OrderActions.cancelOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.cancelOrderSuccess, (state, { order }) => {
    const updatedOrders = updateOrderInArray(state.orders, order);
    return {
      ...state,
      orders: updatedOrders,
      filteredOrders: applyFiltersToOrders(updatedOrders, state.filters),
      selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
      loading: false,
      error: null
    };
  }),

  on(OrderActions.cancelOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Filters
  on(OrderActions.updateFilters, (state, { filters }) => {
    const updatedFilters = { ...state.filters, ...filters };
    const filteredOrders = applyFiltersToOrders(state.orders, updatedFilters);
    return {
      ...state,
      filters: updatedFilters,
      filteredOrders,
      pagination: {
        ...state.pagination,
        currentPage: 1, // Reset to first page when filters change
        totalItems: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / state.pagination.pageSize)
      }
    };
  }),

  on(OrderActions.clearFilters, (state) => {
    const filteredOrders = state.orders; // No filters means all orders
    return {
      ...state,
      filters: initialOrderState.filters,
      filteredOrders,
      pagination: {
        ...state.pagination,
        currentPage: 1,
        totalItems: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / state.pagination.pageSize)
      }
    };
  }),

  // View Mode
  on(OrderActions.setViewMode, (state, { viewMode }) => ({
    ...state,
    viewMode
  })),

  // Selection
  on(OrderActions.selectOrder, (state, { order }) => ({
    ...state,
    selectedOrder: order
  })),

  // Pagination
  on(OrderActions.setPage, (state, { page }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      currentPage: page
    }
  })),

  on(OrderActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      pageSize,
      currentPage: 1,
      totalItems: state.filteredOrders.length,
      totalPages: Math.ceil(state.filteredOrders.length / pageSize)
    }
  })),

  // Clear Actions
  on(OrderActions.clearOrders, () => ({
    ...initialOrderState
  })),

  on(OrderActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);

// Helper functions
function updateOrderInArray(orders: Order[], updatedOrder: Order): Order[] {
  const index = orders.findIndex(order => order.id === updatedOrder.id);
  if (index !== -1) {
    return [
      ...orders.slice(0, index),
      updatedOrder,
      ...orders.slice(index + 1)
    ];
  }
  return orders;
}

function applyFiltersToOrders(orders: Order[], filters: OrderState['filters']): Order[] {
  return orders.filter(order => {
    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(order.status)) {
      return false;
    }

    // Customer filter
    if (filters.customerIds.length > 0 && !filters.customerIds.includes(order.customerId)) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm.trim() !== '') {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchFields = [
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.trackingNumber || ''
      ].join(' ').toLowerCase();

      if (!searchFields.includes(searchTerm)) {
        return false;
      }
    }

    // Amount filters
    if (filters.minAmount !== undefined && order.total < filters.minAmount) {
      return false;
    }

    if (filters.maxAmount !== undefined && order.total > filters.maxAmount) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.startDate && order.orderDate < filters.dateRange.startDate) {
      return false;
    }

    if (filters.dateRange.endDate && order.orderDate > filters.dateRange.endDate) {
      return false;
    }

    return true;
  });
}
