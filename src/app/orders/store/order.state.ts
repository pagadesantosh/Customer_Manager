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
