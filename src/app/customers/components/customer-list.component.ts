import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../models';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customer-list">
      <div class="list-header">
        <div class="list-controls">
          <button class="sort-button" 
                  (click)="onSort('fullName')"
                  [class.active]="sortField === 'fullName'">
            Name
            <span class="sort-indicator" *ngIf="sortField === 'fullName'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
          <button class="sort-button" 
                  (click)="onSort('company')"
                  [class.active]="sortField === 'company'">
            Company
            <span class="sort-indicator" *ngIf="sortField === 'company'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
          <button class="sort-button" 
                  (click)="onSort('state')"
                  [class.active]="sortField === 'state'">
            State
            <span class="sort-indicator" *ngIf="sortField === 'state'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
          <button class="sort-button" 
                  (click)="onSort('revenue')"
                  [class.active]="sortField === 'revenue'">
            Revenue
            <span class="sort-indicator" *ngIf="sortField === 'revenue'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
        </div>
      </div>
      
      <div class="list-items">
        <div class="list-item" 
             *ngFor="let customer of sortedCustomers; trackBy: trackByCustomerId"
             [class.selected]="selectedCustomerId === customer.id"
             (click)="onSelect(customer)">
          
          <div class="item-avatar">
            <img [src]="customer.avatarUrl" 
                 [alt]="customer.fullName"
                 (error)="onImageError($event, customer)">
          </div>
          
          <div class="item-info">
            <h4 class="item-name">{{ customer.fullName }}</h4>
            <p class="item-title">{{ customer.jobTitle }}</p>
          </div>
          
          <div class="item-company">
            <span>{{ customer.company }}</span>
          </div>
          
          <div class="item-location">
            <span>{{ customer.city }}, {{ customer.state }}</span>
          </div>
          
          <div class="item-status">
            <span class="status-badge" [class]="'status-' + customer.status">
              {{ customer.status | titlecase }}
            </span>
          </div>
          
          <div class="item-revenue">
            <span class="revenue-amount">{{ customer.revenueFormatted }}</span>
          </div>
          
          <div class="item-actions">
            <button class="action-button" (click)="onViewDetails($event, customer)">
              View
            </button>
          </div>
        </div>
      </div>
      
      <div class="list-footer" *ngIf="customers.length === 0">
        <p class="no-results">No customers found matching your criteria.</p>
      </div>
    </div>
  `,
  styles: [`
    .customer-list {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .list-header {
      background: #f8f9fa;
      padding: 16px 20px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .list-controls {
      display: flex;
      gap: 16px;
    }
    
    .sort-button {
      background: none;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 500;
      color: #6c757d;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .sort-button:hover {
      background: #e9ecef;
      color: #495057;
    }
    
    .sort-button.active {
      background: #007bff;
      color: white;
    }
    
    .sort-indicator {
      font-size: 0.8rem;
    }
    
    .list-items {
      max-height: 600px;
      overflow-y: auto;
    }
    
    .list-item {
      display: grid;
      grid-template-columns: 50px 2fr 1.5fr 1.5fr 100px 120px 80px;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid #f8f9fa;
      cursor: pointer;
      transition: background-color 0.2s ease;
      align-items: center;
    }
    
    .list-item:hover {
      background: #f8f9ff;
    }
    
    .list-item.selected {
      background: #e3f2fd;
      border-left: 4px solid #007bff;
    }
    
    .item-avatar img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .item-name {
      margin: 0 0 4px 0;
      font-size: 1rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .item-title {
      margin: 0;
      font-size: 0.85rem;
      color: #6c757d;
    }
    
    .item-company {
      font-weight: 500;
      color: #495057;
    }
    
    .item-location {
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
      display: inline-block;
      min-width: 60px;
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
    
    .item-revenue {
      text-align: right;
    }
    
    .revenue-amount {
      font-weight: 600;
      color: #28a745;
    }
    
    .action-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.2s ease;
    }
    
    .action-button:hover {
      background: #0056b3;
    }
    
    .list-footer {
      padding: 40px;
      text-align: center;
    }
    
    .no-results {
      color: #6c757d;
      font-style: italic;
      margin: 0;
    }
    
    @media (max-width: 1024px) {
      .list-item {
        grid-template-columns: 40px 2fr 1fr 80px 60px;
        gap: 12px;
      }
      
      .item-company,
      .item-location {
        display: none;
      }
    }
    
    @media (max-width: 768px) {
      .list-item {
        grid-template-columns: 40px 1fr 80px;
        gap: 8px;
      }
      
      .item-status,
      .item-revenue {
        display: none;
      }
      
      .list-controls {
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .sort-button {
        padding: 6px 8px;
        font-size: 0.85rem;
      }
    }
  `]
})
export class CustomerListComponent {
  @Input() customers: Customer[] = [];
  @Input() selectedCustomerId: number | null = null;
  @Output() select = new EventEmitter<Customer>();
  @Output() viewDetails = new EventEmitter<Customer>();

  sortField: keyof Customer | 'fullName' = 'fullName';
  sortDirection: 'asc' | 'desc' = 'asc';

  get sortedCustomers(): Customer[] {
    if (!this.customers?.length) return [];
    
    return [...this.customers].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      if (this.sortField === 'fullName') {
        aValue = a.fullName;
        bValue = b.fullName;
      } else {
        aValue = a[this.sortField];
        bValue = b[this.sortField];
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onSort(field: keyof Customer | 'fullName'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  onSelect(customer: Customer): void {
    this.select.emit(customer);
  }

  onViewDetails(event: Event, customer: Customer): void {
    event.stopPropagation();
    this.viewDetails.emit(customer);
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  onImageError(event: Event, customer: Customer): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/40x40/6c757d/ffffff?text=' + 
              customer.firstName.charAt(0) + customer.lastName.charAt(0);
  }
}
