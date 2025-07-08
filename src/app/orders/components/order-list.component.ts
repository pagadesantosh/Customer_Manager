import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-list">
      <div class="table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders; trackBy: trackByOrderId" 
                class="order-row"
                [class.selected]="selectedOrder?.id === order.id"
                (click)="onSelectOrder(order)">
              <td class="order-number">
                <span class="number-link">{{ order.orderNumber }}</span>
              </td>
              <td class="customer-info">
                <div class="customer-details">
                  <span class="customer-name">{{ order.customerName }}</span>
                  <span class="customer-email">{{ order.customerEmail }}</span>
                </div>
              </td>
              <td class="order-date">
                {{ order.orderDate | date:'shortDate' }}
              </td>
              <td class="item-count">
                {{ order.itemCount }} {{ order.itemCount === 1 ? 'item' : 'items' }}
              </td>
              <td class="order-total">
                {{ order.total | currency }}
              </td>
              <td class="order-status">
                <span class="status-badge" 
                      [style.background-color]="order.statusColor">
                  {{ order.status | titlecase }}
                </span>
              </td>
              <td class="payment-status">
                <span class="payment-badge" 
                      [style.background-color]="order.paymentStatusColor">
                  {{ order.paymentStatus | titlecase }}
                </span>
              </td>
              <td class="order-actions">
                <div class="action-buttons">
                  <button type="button" 
                          class="action-btn view-btn" 
                          (click)="onViewOrder($event, order)"
                          title="View Order">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  </button>
                  <button type="button" 
                          class="action-btn edit-btn" 
                          (click)="onEditOrder($event, order)"
                          *ngIf="order.isEditable"
                          title="Edit Order">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-4-4L1.5 10.207V13.5h3.293L11.207 9z"/>
                    </svg>
                  </button>
                  <button type="button" 
                          class="action-btn cancel-btn" 
                          (click)="onCancelOrder($event, order)"
                          *ngIf="order.isCancellable"
                          title="Cancel Order">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="no-orders" *ngIf="orders.length === 0">
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3 2.5a2.5 2.5 0 0 1 5 0V3h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4v-.5zM4 4v9h8V4H4z"/>
          </svg>
          <h3>No Orders Found</h3>
          <p>There are no orders to display with the current filters.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-list {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .orders-table th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
      padding: 16px 12px;
      text-align: left;
      border-bottom: 2px solid #e9ecef;
      font-size: 0.9rem;
      white-space: nowrap;
    }
    
    .orders-table td {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
      vertical-align: middle;
    }
    
    .order-row {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .order-row:hover {
      background: #f8f9ff;
    }
    
    .order-row.selected {
      background: #e3f2fd;
      border-left: 4px solid #007bff;
    }
    
    .number-link {
      color: #007bff;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .customer-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .customer-name {
      font-weight: 500;
      color: #495057;
      font-size: 0.9rem;
    }
    
    .customer-email {
      color: #6c757d;
      font-size: 0.8rem;
    }
    
    .order-date {
      color: #495057;
      font-size: 0.9rem;
    }
    
    .item-count {
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .order-total {
      font-weight: 600;
      color: #28a745;
      font-size: 0.95rem;
    }
    
    .status-badge, .payment-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      color: white;
      text-align: center;
      display: inline-block;
      min-width: 70px;
    }
    
    .action-buttons {
      display: flex;
      gap: 6px;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
    }
    
    .action-btn svg {
      width: 16px;
      height: 16px;
    }
    
    .view-btn {
      background: #17a2b8;
      color: white;
    }
    
    .view-btn:hover {
      background: #138496;
      transform: scale(1.05);
    }
    
    .edit-btn {
      background: #007bff;
      color: white;
    }
    
    .edit-btn:hover {
      background: #0056b3;
      transform: scale(1.05);
    }
    
    .cancel-btn {
      background: #dc3545;
      color: white;
    }
    
    .cancel-btn:hover {
      background: #c82333;
      transform: scale(1.05);
    }
    
    .no-orders {
      padding: 60px 20px;
    }
    
    .empty-state {
      text-align: center;
      color: #6c757d;
    }
    
    .empty-state svg {
      color: #dee2e6;
      margin-bottom: 16px;
    }
    
    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #495057;
    }
    
    .empty-state p {
      margin: 0;
      font-size: 0.9rem;
    }
    
    @media (max-width: 1024px) {
      .orders-table th,
      .orders-table td {
        padding: 10px 8px;
        font-size: 0.85rem;
      }
      
      .customer-email {
        display: none;
      }
    }
    
    @media (max-width: 768px) {
      .orders-table {
        font-size: 0.8rem;
      }
      
      .orders-table th:nth-child(3),
      .orders-table td:nth-child(3),
      .orders-table th:nth-child(4),
      .orders-table td:nth-child(4) {
        display: none;
      }
      
      .action-buttons {
        flex-direction: column;
        gap: 4px;
      }
      
      .action-btn {
        width: 28px;
        height: 28px;
      }
      
      .action-btn svg {
        width: 14px;
        height: 14px;
      }
    }
  `]
})
export class OrderListComponent {
  @Input() orders: Order[] = [];
  @Input() selectedOrder: Order | null = null;
  @Output() selectOrder = new EventEmitter<Order>();
  @Output() viewOrder = new EventEmitter<Order>();
  @Output() editOrder = new EventEmitter<Order>();
  @Output() cancelOrder = new EventEmitter<Order>();

  trackByOrderId(index: number, order: Order): number {
    return order.id;
  }

  onSelectOrder(order: Order): void {
    this.selectOrder.emit(order);
  }

  onViewOrder(event: Event, order: Order): void {
    event.stopPropagation();
    this.viewOrder.emit(order);
  }

  onEditOrder(event: Event, order: Order): void {
    event.stopPropagation();
    this.editOrder.emit(order);
  }

  onCancelOrder(event: Event, order: Order): void {
    event.stopPropagation();
    this.cancelOrder.emit(order);
  }
}
