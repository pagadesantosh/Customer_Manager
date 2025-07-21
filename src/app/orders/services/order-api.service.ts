import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, map, switchMap } from 'rxjs';
import { Order, OrderFilters } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private readonly apiUrl = '/api/orders'; // Replace with your actual API URL
  private customersCache: any[] = [];

  constructor(private http: HttpClient) {
    // Load customer data for proper name/email matching
    this.loadCustomerData();
  }

  // Get all orders with filtering
  getOrders(filters?: OrderFilters): Observable<Order[]> {
    // For demo purposes, return mock data
    // In production, replace with actual HTTP call
    return this.getMockOrders(filters).pipe(delay(500));
  }

  // Get orders for a specific customer
  getOrdersByCustomer(customerId: number): Observable<Order[]> {
    // For demo purposes, return mock data filtered by customer
    return this.getMockOrders({ customerIds: [customerId] } as OrderFilters).pipe(delay(300));
  }

  // Get single order by ID
  getOrderById(orderId: number): Observable<Order> {
    // For demo purposes, return mock data
    const orders = this.generateMockOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    return of(order).pipe(delay(200));
  }

  // Create new order
  createOrder(order: Partial<Order>): Observable<Order> {
    // In production, make HTTP POST request
    const newOrder = this.createMockOrder(order);
    return of(newOrder).pipe(delay(500));
  }

  // Update existing order
  updateOrder(orderId: number, order: Partial<Order>): Observable<Order> {
    // In production, make HTTP PUT request
    const updatedOrder = { ...order, id: orderId } as Order;
    return of(updatedOrder).pipe(delay(500));
  }

  // Cancel order
  cancelOrder(orderId: number): Observable<Order> {
    // In production, make HTTP PATCH request
    return this.updateOrder(orderId, { status: 'cancelled' });
  }

  // Get customer information by ID (for proper name/email matching)
  getCustomerById(customerId: number): Observable<any> {
    if (this.customersCache.length > 0) {
      const customer = this.customersCache.find(c => parseInt(c.id) === customerId);
      if (customer) {
        return of({
          id: parseInt(customer.id),
          firstName: customer.first_name,
          lastName: customer.last_name,
          email: customer.email,
          phone: customer.phone
        });
      }
    }
    
    // Fallback to loading from JSON if not in cache
    return this.http.get<{customers: any[]}>(environment.customerDataFile).pipe(
      map(response => {
        const customer = response.customers.find(c => parseInt(c.id) === customerId);
        if (customer) {
          return {
            id: parseInt(customer.id),
            firstName: customer.first_name,
            lastName: customer.last_name,
            email: customer.email,
            phone: customer.phone
          };
        }
        return null;
      })
    );
  }

  // Method to refresh order data with current customer information
  refreshOrderCustomerData(order: Order): Observable<Order> {
    return this.getCustomerById(order.customerId).pipe(
      map(customer => {
        if (customer) {
          const refreshedOrder = Object.assign(new Order(), {
            ...order,
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerEmail: customer.email,
            customerPhone: customer.phone
          });
          return refreshedOrder;
        }
        return order;
      })
    );
  }

  // Private methods for mock data
  private getMockOrders(filters?: OrderFilters): Observable<Order[]> {
    let orders = this.generateMockOrders();

    if (filters) {
      // Apply filters
      if (filters.customerIds?.length) {
        orders = orders.filter(order => filters.customerIds.includes(order.customerId));
      }

      if (filters.statuses?.length) {
        orders = orders.filter(order => filters.statuses.includes(order.status));
      }

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        orders = orders.filter(order => 
          order.orderNumber.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term) ||
          order.customerEmail.toLowerCase().includes(term)
        );
      }

      if (filters.minAmount !== undefined) {
        orders = orders.filter(order => order.total >= filters.minAmount!);
      }

      if (filters.maxAmount !== undefined) {
        orders = orders.filter(order => order.total <= filters.maxAmount!);
      }

      if (filters.dateRange?.startDate) {
        orders = orders.filter(order => order.orderDate >= filters.dateRange.startDate!);
      }

      if (filters.dateRange?.endDate) {
        orders = orders.filter(order => order.orderDate <= filters.dateRange.endDate!);
      }
    }

    return of(orders);
  }

  private generateMockOrders(): Order[] {
    const orders: Order[] = [];

    for (let i = 1; i <= 50; i++) {
      let customer;
      
      // Use cached customer data if available, otherwise use default data
      if (this.customersCache.length > 0) {
        const customerIndex = Math.floor(Math.random() * Math.min(10, this.customersCache.length));
        const customerData = this.customersCache[customerIndex];
        customer = {
          id: parseInt(customerData.id),
          firstName: customerData.first_name,
          lastName: customerData.last_name,
          email: customerData.email
        };
      } else {
        // Fallback data that matches the actual customer JSON structure
        const fallbackCustomers = [
          { id: 1, firstName: 'Margret', lastName: 'Waelchi', email: 'margret_waelchi30@hotmail.com' },
          { id: 2, firstName: 'Tad', lastName: 'Lubowitz', email: 'tad.lubowitz41@yahoo.com' },
          { id: 3, firstName: 'Gwen', lastName: 'Ortiz', email: 'gwen.ortiz@yahoo.com' },
          { id: 4, firstName: 'Bobbie', lastName: 'Considine', email: 'bobbie_considine@hotmail.com' },
          { id: 5, firstName: 'Janis', lastName: 'Haley', email: 'janis_haley@gmail.com' },
          { id: 6, firstName: 'Sherri', lastName: 'Windler', email: 'sherri.windler@yahoo.com' },
          { id: 7, firstName: 'Marty', lastName: 'Yundt', email: 'marty_yundt@hotmail.com' },
          { id: 8, firstName: 'Myron', lastName: 'Hagenes', email: 'myron.hagenes@gmail.com' },
          { id: 9, firstName: 'Ethel', lastName: 'Becker', email: 'ethel_becker@yahoo.com' },
          { id: 10, firstName: 'Lucille', lastName: 'Wiegand', email: 'lucille.wiegand@hotmail.com' }
        ];
        const customerIndex = Math.floor(Math.random() * fallbackCustomers.length);
        customer = fallbackCustomers[customerIndex];
      }

      orders.push(this.createMockOrder({
        id: i,
        customerId: customer.id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email
      }));
    }

    return orders;
  }

  private loadCustomerData(): void {
    this.http.get<{customers: any[]}>(environment.customerDataFile).subscribe({
      next: (response) => {
        this.customersCache = response.customers.slice(0, 20); // Cache first 20 customers
      },
      error: (error) => {
        console.warn('Could not load customer data, using fallback data:', error);
      }
    });
  }

  private createMockOrder(partial: Partial<Order>): Order {
    const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentStatuses: Order['paymentStatus'][] = ['pending', 'paid', 'failed', 'refunded'];
    
    const items = this.generateMockOrderItems();
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = 15.99;
    const discount = 0;
    const total = subtotal + tax + shipping - discount;

    const orderDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const order = Object.assign(new Order(), {
      id: partial.id || Math.floor(Math.random() * 10000),
      orderNumber: `ORD-${String(partial.id || Math.floor(Math.random() * 10000)).padStart(6, '0')}`,
      customerId: partial.customerId || 1,
      customerName: partial.customerName || 'John Doe',
      customerEmail: partial.customerEmail || 'john.doe@example.com',
      customerPhone: '+1 (555) 123-4567',
      orderDate: orderDate,
      status: status,
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      items: items,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      discount: discount,
      total: total,
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
      },
      billingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...partial
    });

    // Set tracking number for shipped/delivered orders
    if (['shipped', 'delivered'].includes(order.status)) {
      order.trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      order.shippedDate = new Date(order.orderDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    }

    if (order.status === 'delivered' && order.shippedDate) {
      order.deliveredDate = new Date(order.shippedDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000);
    }

    return order;
  }

  private generateMockOrderItems(): Order['items'] {
    const products = [
      { name: 'Laptop Pro 15"', sku: 'LAP-001', price: 1299.99 },
      { name: 'Wireless Mouse', sku: 'MOU-001', price: 49.99 },
      { name: 'USB-C Hub', sku: 'HUB-001', price: 79.99 },
      { name: 'Monitor 27"', sku: 'MON-001', price: 399.99 },
      { name: 'Keyboard Mechanical', sku: 'KEY-001', price: 129.99 },
      { name: 'Webcam HD', sku: 'CAM-001', price: 89.99 },
      { name: 'Headphones', sku: 'HEP-001', price: 199.99 },
      { name: 'Tablet 10"', sku: 'TAB-001', price: 599.99 }
    ];

    const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items
    const items: Order['items'] = [];

    for (let i = 0; i < itemCount; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      
      items.push({
        id: i + 1,
        productId: Math.floor(Math.random() * 1000),
        productName: product.name,
        productSku: product.sku,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
        productImageUrl: `https://via.placeholder.com/100x100/4CAF50/ffffff?text=${product.name.charAt(0)}`
      });
    }

    return items;
  }
}
