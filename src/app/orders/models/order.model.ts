import { Transform } from 'class-transformer';

export interface OrderFilters {
  statuses: OrderStatus[];
  dateRange: {
    startDate?: Date;
    endDate?: Date;
  };
  customerIds: number[];
  searchTerm: string;
  minAmount?: number;
  maxAmount?: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderViewMode = 'card' | 'list' | 'timeline';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImageUrl?: string;
}

export class Order {
  id!: number;
  orderNumber!: string;
  customerId!: number;
  
  // Customer info for easier display
  customerName!: string;
  customerEmail!: string;
  customerPhone!: string;

  @Transform(({ value }) => value ? new Date(value) : new Date())
  orderDate!: Date;

  @Transform(({ value }) => value ? new Date(value) : null)
  shippedDate?: Date;

  @Transform(({ value }) => value ? new Date(value) : null)
  deliveredDate?: Date;

  status!: OrderStatus;
  paymentStatus!: PaymentStatus;

  // Order items
  items!: OrderItem[];

  // Pricing
  subtotal!: number;
  tax!: number;
  shipping!: number;
  discount!: number;
  total!: number;

  // Addresses
  shippingAddress!: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  billingAddress!: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Additional info
  notes?: string;
  trackingNumber?: string;
  paymentMethod!: string;

  @Transform(({ value }) => value ? new Date(value) : new Date())
  createdAt!: Date;

  @Transform(({ value }) => value ? new Date(value) : new Date())
  updatedAt!: Date;

  // Computed properties
  get itemCount(): number {
    return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  get statusColor(): string {
    const statusColors: Record<OrderStatus, string> = {
      pending: '#ffc107',
      processing: '#007bff',
      shipped: '#17a2b8',
      delivered: '#28a745',
      cancelled: '#dc3545',
      returned: '#6f42c1'
    };
    return statusColors[this.status] || '#6c757d';
  }

  get paymentStatusColor(): string {
    const statusColors: Record<PaymentStatus, string> = {
      pending: '#ffc107',
      paid: '#28a745',
      failed: '#dc3545',
      refunded: '#6f42c1'
    };
    return statusColors[this.paymentStatus] || '#6c757d';
  }

  get isEditable(): boolean {
    return ['pending', 'processing'].includes(this.status);
  }

  get isCancellable(): boolean {
    return ['pending', 'processing'].includes(this.status);
  }
}
