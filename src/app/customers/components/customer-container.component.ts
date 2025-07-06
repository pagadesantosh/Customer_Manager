import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, map } from 'rxjs';

import { Customer, CustomerFilters, ViewMode } from '../models';
import { CustomerActions } from '../store';
import * as CustomerSelectors from '../store/customer.selectors';

// Import standalone components
import { CustomerCardComponent } from './customer-card.component';
import { CustomerListComponent } from './customer-list.component';
import { CustomerMapComponent } from './customer-map.component';
import { CustomerFiltersComponent } from './customer-filters.component';

@Component({
  selector: 'app-customer-container',
  standalone: true,
  imports: [
    CommonModule,
    CustomerCardComponent,
    CustomerListComponent,
    CustomerMapComponent,
    CustomerFiltersComponent
  ],
  template: `
    <div class="customer-container">
      <!-- Main Content Layout -->
      <div class="main-content">
        <!-- Left Sidebar - Filters Section -->
        <div class="filters-sidebar">
          <app-customer-filters
            [currentFilters]="(currentFilters$ | async) || {states: [], companies: [], statuses: [], searchTerm: ''}"
            [availableStates]="(availableStates$ | async) || []"
            [availableCompanies]="(availableCompanies$ | async) || []"
            [loading]="(loadingFilterOptions$ | async) || false"
            (searchTermChange)="onSearchTermChange($event)"
            (stateToggle)="onStateToggle($event)"
            (companyToggle)="onCompanyToggle($event)"
            (statusToggle)="onStatusToggle($event)"
            (clearFilters)="onClearFilters()">
          </app-customer-filters>
        </div>
        
        <!-- Right Section - Customer Content -->
        <div class="customers-section">
          <!-- Customer Stats Header -->
          <div class="stats-header" *ngIf="customerStats$ | async as stats">
            <div class="stats-container">
              <div class="stat-card">
                <span class="stat-label">Total Customers</span>
                <span class="stat-value">{{ stats.total }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Filtered Results</span>
                <span class="stat-value">{{ stats.filtered }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Total Revenue</span>
                <span class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Loading State -->
          <div class="loading-container" *ngIf="loading$ | async">
            <div class="loading-spinner"></div>
            <p>Loading customers...</p>
          </div>
          
          <!-- Error State -->
          <div class="error-container" *ngIf="error$ | async as error">
            <div class="error-message">
              <h3>Error Loading Customers</h3>
              <p>{{ error }}</p>
              <button class="retry-button" (click)="onRetry()">
                Retry
              </button>
            </div>
          </div>
          
          <!-- Customer Views -->
          <div class="customers-content" *ngIf="!(loading$ | async) && !(error$ | async)">
            <!-- Card View -->
            <div class="card-view" 
                 *ngIf="(viewMode$ | async) === 'card'">
              <div class="customer-cards">
                <app-customer-card
                  *ngFor="let customer of filteredCustomers$ | async; trackBy: trackByCustomerId"
                  [customer]="customer"
                  [isSelected]="(selectedCustomerId$ | async) === customer.id"
                  (select)="onCustomerSelect($event)">
                </app-customer-card>
              </div>
            </div>
            
            <!-- List View -->
            <div class="list-view" 
                 *ngIf="(viewMode$ | async) === 'list'">
              <app-customer-list
                [customers]="(filteredCustomers$ | async) || []"
                [selectedCustomerId]="selectedCustomerId$ | async"
                (select)="onCustomerSelect($event)"
                (viewDetails)="onViewCustomerDetails($event)">
              </app-customer-list>
            </div>
            
            <!-- Map View -->
            <div class="map-view" 
                 *ngIf="(viewMode$ | async) === 'map'">
              <app-customer-map
                [customers]="(filteredCustomers$ | async) || []"
                [selectedCustomerId]="selectedCustomerId$ | async"
                (customerSelect)="onCustomerSelect($event)">
              </app-customer-map>
            </div>
            
            <!-- Empty State -->
            <div class="empty-state" 
                 *ngIf="(filteredCustomers$ | async)?.length === 0">
              <div class="empty-message">
                <h3>No customers found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button class="clear-filters-button" (click)="onClearFilters()">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-container {
      padding: 20px;
      background: #f8f9fa;
      min-height: calc(100vh - 120px); /* Adjust for header height */
    }
    
    /* Main Layout - Two Column */
    .main-content {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
      align-items: start;
    }
    
    .filters-sidebar {
      position: sticky;
      top: 140px; /* Account for fixed header */
      max-height: calc(100vh - 160px);
      overflow-y: auto;
    }
    
    .customers-section {
      min-height: 600px;
    }
    
    /* Stats Header */
    .stats-header {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    
    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 8px;
      border: 1px solid #e9ecef;
      transition: all 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .stat-label {
      font-size: 0.85rem;
      color: #6c757d;
      font-weight: 500;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .loading-container,
    .error-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
      margin-bottom: 20px;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e9ecef;
      border-left: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-message h3 {
      color: #dc3545;
      margin: 0 0 8px 0;
    }
    
    .error-message p {
      color: #6c757d;
      margin: 0 0 16px 0;
    }
    
    .retry-button,
    .clear-filters-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    
    .retry-button:hover,
    .clear-filters-button:hover {
      background: #0056b3;
    }
    
    .customers-content {
      min-height: 400px;
    }
    
    .customer-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    
    .empty-state {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 60px 40px;
      text-align: center;
    }
    
    .empty-message h3 {
      color: #6c757d;
      margin: 0 0 8px 0;
    }
    
    .empty-message p {
      color: #6c757d;
      margin: 0 0 20px 0;
    }
    
    /* Responsive Design */
    @media (max-width: 1200px) {
      .main-content {
        grid-template-columns: 280px 1fr;
        gap: 16px;
      }
      
      .customer-cards {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }
      
      .stats-container {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
      }
    }
    
    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .filters-sidebar {
        position: static;
        max-height: none;
        order: -1;
      }
      
      .customer-cards {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }
      
      .stats-container {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .customer-container {
        padding: 16px;
      }
      
      .main-content {
        gap: 16px;
      }
      
      .customer-cards {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .stats-container {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .stat-card {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
      }
      
      .stat-label {
        margin-bottom: 0;
        font-size: 0.9rem;
      }
      
      .stat-value {
        font-size: 1.5rem;
      }
    }
    
    @media (max-width: 480px) {
      .customer-container {
        padding: 12px;
      }
      
      .loading-container,
      .error-container {
        padding: 30px 20px;
      }
      
      .empty-state {
        padding: 40px 20px;
      }
      
      .stats-header {
        padding: 16px;
      }
    }
  `]
})
export class CustomerContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Observables
  filteredCustomers$: Observable<Customer[]>;
  currentFilters$: Observable<CustomerFilters>;
  viewMode$: Observable<ViewMode>;
  selectedCustomerId$: Observable<number | null>;
  availableStates$: Observable<string[]>;
  availableCompanies$: Observable<string[]>;
  loading$: Observable<boolean>;
  loadingFilterOptions$: Observable<boolean>;
  error$: Observable<string | null>;
  customerStats$: Observable<any>;

  constructor(private store: Store) {
    // Initialize observables
    this.filteredCustomers$ = this.store.select(CustomerSelectors.selectFilteredCustomers);
    this.currentFilters$ = this.store.select(CustomerSelectors.selectFilters);
    this.viewMode$ = this.store.select(CustomerSelectors.selectViewMode);
    this.selectedCustomerId$ = this.store.select(CustomerSelectors.selectCustomerState).pipe(
      map(state => state.selectedCustomerId),
      takeUntil(this.destroy$)
    );
    this.availableStates$ = this.store.select(CustomerSelectors.selectAvailableStates);
    this.availableCompanies$ = this.store.select(CustomerSelectors.selectAvailableCompanies);
    this.loading$ = this.store.select(CustomerSelectors.selectLoading);
    this.loadingFilterOptions$ = this.store.select(CustomerSelectors.selectLoadingFilterOptions);
    this.error$ = this.store.select(CustomerSelectors.selectError);
    this.customerStats$ = this.store.select(CustomerSelectors.selectCustomerStats);
  }

  ngOnInit(): void {
    // Load initial data
    this.store.dispatch(CustomerActions.loadCustomers());
    this.store.dispatch(CustomerActions.loadFilterOptions());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers
  onViewModeChange(viewMode: ViewMode): void {
    this.store.dispatch(CustomerActions.switchViewMode({ viewMode }));
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.dispatch(CustomerActions.setSearchTerm({ searchTerm }));
  }

  onStateToggle(state: string): void {
    this.store.dispatch(CustomerActions.toggleStateFilter({ state }));
  }

  onCompanyToggle(company: string): void {
    this.store.dispatch(CustomerActions.toggleCompanyFilter({ company }));
  }

  onStatusToggle(status: string): void {
    this.store.dispatch(CustomerActions.toggleStatusFilter({ status }));
  }

  onClearFilters(): void {
    this.store.dispatch(CustomerActions.clearFilters());
  }

  onCustomerSelect(customer: Customer): void {
    this.store.dispatch(CustomerActions.selectCustomer({ customerId: customer.id }));
  }

  onViewCustomerDetails(customer: Customer): void {
    this.store.dispatch(CustomerActions.selectCustomer({ customerId: customer.id }));
    // Additional logic for viewing details (e.g., navigate to detail page)
    console.log('View details for customer:', customer);
  }

  onRetry(): void {
    this.store.dispatch(CustomerActions.loadCustomers());
    this.store.dispatch(CustomerActions.loadFilterOptions());
  }

  // Utility methods
  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
