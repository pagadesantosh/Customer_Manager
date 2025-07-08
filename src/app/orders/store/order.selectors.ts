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

// Computed selectors
export const selectOrdersCount = createSelector(
  selectAllOrders,
  (orders) => orders.length
);

export const selectFilteredOrdersCount = createSelector(
  selectFilteredOrders,
  (orders) => orders.length
);

export const selectPaginatedOrders = createSelector(
  selectFilteredOrders,
  selectOrderPagination,
  (orders, pagination) => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return orders.slice(startIndex, endIndex);
  }
);

// Customer-specific selectors
export const selectOrdersByCustomer = (customerId: number) => createSelector(
  selectCustomerOrders,
  (customerOrders) => customerOrders[customerId] || []
);

export const selectOrderById = (orderId: number) => createSelector(
  selectAllOrders,
  (orders) => orders.find(order => order.id === orderId)
);

// Filter-specific selectors
export const selectActiveFiltersCount = createSelector(
  selectOrderFilters,
  (filters: OrderFilters) => {
    let count = 0;
    if (filters.statuses.length > 0) count++;
    if (filters.customerIds.length > 0) count++;
    if (filters.searchTerm.trim() !== '') count++;
    if (filters.minAmount !== undefined) count++;
    if (filters.maxAmount !== undefined) count++;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count++;
    return count;
  }
);

export const selectHasActiveFilters = createSelector(
  selectActiveFiltersCount,
  (count) => count > 0
);

// Statistics selectors
export const selectOrderStatistics = createSelector(
  selectAllOrders,
  (orders) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentOrders = orders
      .filter(order => {
        const daysDiff = (new Date().getTime() - order.orderDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 30;
      })
      .length;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusCounts,
      recentOrders
    };
  }
);

// UI state selectors
export const selectIsLoading = createSelector(
  selectOrderLoading,
  (loading) => loading
);

export const selectHasError = createSelector(
  selectOrderError,
  (error) => !!error
);

export const selectCanLoadMore = createSelector(
  selectOrderPagination,
  (pagination) => pagination.currentPage < pagination.totalPages
);

export const selectCurrentPageInfo = createSelector(
  selectOrderPagination,
  selectFilteredOrdersCount,
  (pagination, totalFilteredItems) => ({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    totalItems: totalFilteredItems,
    totalPages: Math.ceil(totalFilteredItems / pagination.pageSize),
    startItem: (pagination.currentPage - 1) * pagination.pageSize + 1,
    endItem: Math.min(pagination.currentPage * pagination.pageSize, totalFilteredItems)
  })
);
