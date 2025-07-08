import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../models';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-card" 
         [class.selected]="isSelected"
         (click)="onSelect()">
      <div class="order-header">
        <div class="order-info">
          <h3 class="order-number">{{ order.orderNumber }}</h3>
          <p class="customer-name">{{ order.customerName }}</p>
          <p class="order-date">{{ order.orderDate | date:'medium' }}</p>
        </div>
        <div class="order-status">
          <span class="status-badge" 
                [style.background-color]="order.statusColor"
                [class]="'status-' + order.status">
            {{ order.status | titlecase }}
          </span>
          <span class="payment-status-badge"
                [style.background-color]="order.paymentStatusColor"
                [class]="'payment-' + order.paymentStatus">
            {{ order.paymentStatus | titlecase }}
          </span>
        </div>
      </div>
      
      <div class="order-details">
        <div class="detail-item">
          <span class="detail-label">Total Amount:</span>
          <span class="detail-value amount">{{ order.total | currency }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Items:</span>
          <span class="detail-value">{{ order.itemCount }} {{ order.itemCount === 1 ? 'item' : 'items' }}</span>
        </div>
        <div class="detail-item" *ngIf="order.trackingNumber">
          <span class="detail-label">Tracking:</span>
          <span class="detail-value tracking">{{ order.trackingNumber }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Payment:</span>
          <span class="detail-value">{{ order.paymentMethod }}</span>
        </div>
      </div>

      <div class="order-items" *ngIf="order.items && order.items.length > 0">
        <h4>Items:</h4>
        <div class="items-list">
          <div class="item" *ngFor="let item of order.items.slice(0, 3)">
            <img [src]="item.productImageUrl" 
                 [alt]="item.productName"
                 class="item-image"
                 (error)="onItemImageError($event, item)">
            <div class="item-info">
              <span class="item-name">{{ item.productName }}</span>
              <span class="item-details">{{ item.quantity }}x {{ item.unitPrice | currency }}</span>
            </div>
            <span class="item-total">{{ item.totalPrice | currency }}</span>
          </div>
          <div class="more-items" *ngIf="order.items.length > 3">
            +{{ order.items.length - 3 }} more items
          </div>
        </div>
      </div>
      
      <div class="order-footer">
        <div class="order-dates">
          <small *ngIf="order.shippedDate">Shipped: {{ order.shippedDate | date:'shortDate' }}</small>
          <small *ngIf="order.deliveredDate">Delivered: {{ order.deliveredDate | date:'shortDate' }}</small>
        </div>
        <div class="order-actions">
          <button type="button" 
                  class="action-button view-button" 
                  (click)="onView($event)"
                  title="View Order Details">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            </svg>
            View
          </button>
          <button type="button" 
                  class="action-button edit-button" 
                  (click)="onEdit($event)"
                  *ngIf="order.isEditable"
                  title="Edit Order">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-4-4L1.5 10.207V13.5h3.293L11.207 9z"/>
            </svg>
            Edit
          </button>
          <button type="button" 
                  class="action-button cancel-button" 
                  (click)="onCancel($event)"
                  *ngIf="order.isCancellable"
                  title="Cancel Order">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .order-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .order-card.selected {
      border-color: #007bff;
      background: #f8f9ff;
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .order-info h3 {
      margin: 0 0 4px 0;
      color: #007bff;
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .order-info p {
      margin: 2px 0;
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .customer-name {
      font-weight: 500;
      color: #495057 !important;
    }
    
    .order-status {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: flex-end;
    }
    
    .status-badge, .payment-status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      color: white;
      text-align: center;
      min-width: 80px;
    }
    
    .order-details {
      display: grid;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      border-bottom: 1px solid #f8f9fa;
    }
    
    .detail-label {
      font-weight: 500;
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .detail-value {
      color: #495057;
      font-size: 0.9rem;
    }
    
    .detail-value.amount {
      font-weight: 600;
      color: #28a745;
      font-size: 1rem;
    }
    
    .detail-value.tracking {
      font-family: monospace;
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8rem;
    }
    
    .order-items {
      margin-bottom: 16px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .order-items h4 {
      margin: 0 0 12px 0;
      font-size: 0.9rem;
      color: #495057;
    }
    
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px;
      background: white;
      border-radius: 6px;
    }
    
    .item-image {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      object-fit: cover;
    }
    
    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .item-name {
      font-size: 0.8rem;
      font-weight: 500;
      color: #495057;
    }
    
    .item-details {
      font-size: 0.75rem;
      color: #6c757d;
    }
    
    .item-total {
      font-size: 0.8rem;
      font-weight: 500;
      color: #28a745;
    }
    
    .more-items {
      font-size: 0.8rem;
      color: #6c757d;
      text-align: center;
      padding: 6px;
      background: white;
      border-radius: 6px;
      font-style: italic;
    }
    
    .order-footer {
      border-top: 1px solid #e9ecef;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .order-dates {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .order-dates small {
      color: #6c757d;
      font-size: 0.8rem;
    }
    
    .order-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .action-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .action-button svg {
      width: 14px;
      height: 14px;
    }
    
    .view-button {
      background: #17a2b8;
      color: white;
    }
    
    .view-button:hover {
      background: #138496;
    }
    
    .edit-button {
      background: #007bff;
      color: white;
    }
    
    .edit-button:hover {
      background: #0056b3;
    }
    
    .cancel-button {
      background: #dc3545;
      color: white;
    }
    
    .cancel-button:hover {
      background: #c82333;
    }
    
    @media (max-width: 768px) {
      .order-card {
        padding: 16px;
      }
      
      .order-header {
        flex-direction: column;
        gap: 12px;
      }
      
      .order-status {
        align-items: flex-start;
        flex-direction: row;
        gap: 8px;
      }
      
      .order-actions {
        justify-content: center;
      }
      
      .action-button {
        padding: 8px 12px;
      }
    }
  `]
})
export class OrderCardComponent {
  @Input() order!: Order;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<Order>();
  @Output() view = new EventEmitter<Order>();
  @Output() edit = new EventEmitter<Order>();
  @Output() cancel = new EventEmitter<Order>();

  onSelect(): void {
    this.select.emit(this.order);
  }

  onView(event: Event): void {
    event.stopPropagation();
    this.view.emit(this.order);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.order);
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.cancel.emit(this.order);
  }

  onItemImageError(event: Event, item: Order['items'][0]): void {
    const img = event.target as HTMLImageElement;
    img.src = `https://via.placeholder.com/32x32/6c757d/ffffff?text=${item.productName.charAt(0)}`;
  }
}
