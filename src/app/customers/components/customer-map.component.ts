import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../models';

@Component({
  selector: 'app-customer-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div class="map-header">
        <h3>Customer Map View</h3>
        <div class="map-controls">
          <select (change)="onGroupByChange($event)" class="group-select">
            <option value="state">Group by State</option>
            <option value="company">Group by Company</option>
            <option value="status">Group by Status</option>
          </select>
        </div>
      </div>
      
      <div class="map-content">
        <!-- State-based grouping (default) -->
        <div class="state-groups" *ngIf="groupBy === 'state'">
          <div class="state-group" 
               *ngFor="let group of customersByState; trackBy: trackByGroup"
               [style.--customer-count]="group.customers.length">
            <div class="group-header">
              <h4>{{ group.state }}</h4>
              <span class="customer-count">{{ group.customers.length }} customers</span>
            </div>
            <div class="customer-grid">
              <div class="customer-pin" 
                   *ngFor="let customer of group.customers; trackBy: trackByCustomerId"
                   [class.selected]="selectedCustomerId === customer.id"
                   (click)="onCustomerSelect(customer)"
                   [title]="customer.fullName + ' - ' + customer.company">
                <img [src]="customer.avatarUrl" 
                     [alt]="customer.fullName"
                     (error)="onImageError($event, customer)">
                <div class="pin-info">
                  <span class="pin-name">{{ customer.firstName }}</span>
                  <span class="pin-revenue">{{ customer.revenueFormatted }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Company-based grouping -->
        <div class="company-groups" *ngIf="groupBy === 'company'">
          <div class="company-group" 
               *ngFor="let group of customersByCompany; trackBy: trackByGroup">
            <div class="group-header">
              <h4>{{ group.company }}</h4>
              <span class="customer-count">{{ group.customers.length }} customers</span>
            </div>
            <div class="customer-grid">
              <div class="customer-pin" 
                   *ngFor="let customer of group.customers; trackBy: trackByCustomerId"
                   [class.selected]="selectedCustomerId === customer.id"
                   (click)="onCustomerSelect(customer)">
                <img [src]="customer.avatarUrl" 
                     [alt]="customer.fullName"
                     (error)="onImageError($event, customer)">
                <div class="pin-info">
                  <span class="pin-name">{{ customer.firstName }}</span>
                  <span class="pin-location">{{ customer.state }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Status-based grouping -->
        <div class="status-groups" *ngIf="groupBy === 'status'">
          <div class="status-group" 
               *ngFor="let group of customersByStatus; trackBy: trackByGroup">
            <div class="group-header">
              <h4>
                <span class="status-badge" [class]="'status-' + group.status">
                  {{ group.status | titlecase }}
                </span>
              </h4>
              <span class="customer-count">{{ group.customers.length }} customers</span>
            </div>
            <div class="customer-grid">
              <div class="customer-pin" 
                   *ngFor="let customer of group.customers; trackBy: trackByCustomerId"
                   [class.selected]="selectedCustomerId === customer.id"
                   (click)="onCustomerSelect(customer)">
                <img [src]="customer.avatarUrl" 
                     [alt]="customer.fullName"
                     (error)="onImageError($event, customer)">
                <div class="pin-info">
                  <span class="pin-name">{{ customer.firstName }}</span>
                  <span class="pin-location">{{ customer.state }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .map-header {
      background: #f8f9fa;
      padding: 16px 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .map-header h3 {
      margin: 0;
      color: #2c3e50;
    }
    
    .group-select {
      padding: 6px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
    
    .map-content {
      padding: 20px;
      max-height: 600px;
      overflow-y: auto;
    }
    
    .state-groups,
    .company-groups,
    .status-groups {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .state-group,
    .company-group,
    .status-group {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #f8f9ff;
    }
    
    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .group-header h4 {
      margin: 0;
      color: #495057;
      display: flex;
      align-items: center;
    }
    
    .customer-count {
      font-size: 0.85rem;
      color: #6c757d;
      background: white;
      padding: 4px 8px;
      border-radius: 12px;
    }
    
    .customer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 16px;
    }
    
    .customer-pin {
      background: white;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .customer-pin:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      border-color: #007bff;
    }
    
    .customer-pin.selected {
      border-color: #007bff;
      background: #e3f2fd;
    }
    
    .customer-pin img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 8px;
    }
    
    .pin-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .pin-name {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.85rem;
    }
    
    .pin-revenue {
      font-size: 0.75rem;
      color: #28a745;
      font-weight: 500;
    }
    
    .pin-location {
      font-size: 0.75rem;
      color: #6c757d;
    }
    
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
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
    
    @media (max-width: 768px) {
      .map-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }
      
      .customer-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 12px;
      }
      
      .customer-pin {
        padding: 8px;
      }
      
      .customer-pin img {
        width: 40px;
        height: 40px;
      }
    }
  `]
})
export class CustomerMapComponent {
  @Input() customers: Customer[] = [];
  @Input() selectedCustomerId: number | null = null;
  @Output() customerSelect = new EventEmitter<Customer>();

  groupBy: 'state' | 'company' | 'status' = 'state';

  get customersByState() {
    const grouped = this.customers.reduce((acc, customer) => {
      if (!acc[customer.state]) {
        acc[customer.state] = [];
      }
      acc[customer.state].push(customer);
      return acc;
    }, {} as Record<string, Customer[]>);

    return Object.entries(grouped)
      .map(([state, customers]) => ({ state, customers }))
      .sort((a, b) => b.customers.length - a.customers.length);
  }

  get customersByCompany() {
    const grouped = this.customers.reduce((acc, customer) => {
      if (!acc[customer.company]) {
        acc[customer.company] = [];
      }
      acc[customer.company].push(customer);
      return acc;
    }, {} as Record<string, Customer[]>);

    return Object.entries(grouped)
      .map(([company, customers]) => ({ company, customers }))
      .sort((a, b) => b.customers.length - a.customers.length);
  }

  get customersByStatus() {
    const grouped = this.customers.reduce((acc, customer) => {
      if (!acc[customer.status]) {
        acc[customer.status] = [];
      }
      acc[customer.status].push(customer);
      return acc;
    }, {} as Record<string, Customer[]>);

    return Object.entries(grouped)
      .map(([status, customers]) => ({ status, customers }))
      .sort((a, b) => b.customers.length - a.customers.length);
  }

  onGroupByChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.groupBy = target.value as 'state' | 'company' | 'status';
  }

  onCustomerSelect(customer: Customer): void {
    this.customerSelect.emit(customer);
  }

  trackByGroup(index: number, group: any): string {
    return group.state || group.company || group.status;
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  onImageError(event: Event, customer: Customer): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/50x50/6c757d/ffffff?text=' + 
              customer.firstName.charAt(0) + customer.lastName.charAt(0);
  }
}
