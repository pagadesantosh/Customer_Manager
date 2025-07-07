import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../models';

@Component({
  selector: 'app-customer-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customer-card" 
         [class.selected]="isSelected"
         (click)="onSelect()">
      <div class="customer-header">
        <img [src]="customer.avatarUrl" 
             [alt]="customer.fullName"
             class="customer-avatar"
             (error)="onImageError($event)">
        <div class="customer-info">
          <h3 class="customer-name">{{ customer.fullName }}</h3>
          <p class="customer-title">{{ customer.jobTitle }}</p>
          <p class="customer-company">{{ customer.company }}</p>
        </div>
        <div class="customer-status">
          <span class="status-badge" [class]="'status-' + customer.status">
            {{ customer.status | titlecase }}
          </span>
        </div>
      </div>
      
      <div class="customer-details">
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">{{ customer.email }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">{{ customer.phone }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Location:</span>
          <span class="detail-value">{{ customer.city }}, {{ customer.state }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Revenue:</span>
          <span class="detail-value revenue">{{ customer.revenueFormatted }}</span>
        </div>
      </div>
      
      <div class="customer-footer">
        <div class="customer-dates">
          <small>Registered: {{ customer.registrationDate | date:'shortDate' }}</small>
          <small>Last login: {{ customer.lastLogin | date:'shortDate' }}</small>
        </div>
        <div class="customer-actions">
          <button type="button" 
                  class="edit-button" 
                  (click)="onEdit($event)"
                  title="Edit Customer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-4-4L1.5 10.207V13.5h3.293L11.207 9z"/>
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .customer-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .customer-card.selected {
      border-color: #007bff;
      background: #f8f9ff;
    }
    
    .customer-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .customer-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #e9ecef;
    }
    
    .customer-info {
      flex: 1;
    }
    
    .customer-name {
      margin: 0 0 4px 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .customer-title {
      margin: 0 0 4px 0;
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .customer-company {
      margin: 0;
      color: #495057;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .customer-status {
      align-self: flex-start;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .status-active {
      background: #d4edda;
      color: #155724;
    }
    
    .status-inactive {
      background: #f8d7da;
      color: #721c24;
    }
    
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    
    .customer-details {
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
    
    .detail-value.revenue {
      font-weight: 600;
      color: #28a745;
    }
    
    .customer-footer {
      border-top: 1px solid #e9ecef;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .customer-dates {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .customer-dates small {
      color: #6c757d;
      font-size: 0.8rem;
    }

    .customer-actions {
      display: flex;
      gap: 8px;
    }

    .edit-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .edit-button:hover {
      background: #0056b3;
      transform: translateY(-1px);
    }

    .edit-button svg {
      width: 14px;
      height: 14px;
    }
    
    @media (max-width: 768px) {
      .customer-card {
        padding: 16px;
      }
      
      .customer-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .customer-footer {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }

      .customer-dates {
        align-items: center;
      }

      .customer-actions {
        justify-content: center;
      }
    }
  `]
})
export class CustomerCardComponent {
  @Input() customer!: Customer;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<Customer>();
  @Output() edit = new EventEmitter<Customer>();

  onSelect(): void {
    this.select.emit(this.customer);
  }

  onEdit(event: Event): void {
    event.stopPropagation(); // Prevent card selection when clicking edit
    this.edit.emit(this.customer);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/60x60/6c757d/ffffff?text=' + 
              this.customer.firstName.charAt(0) + this.customer.lastName.charAt(0);
  }
}
