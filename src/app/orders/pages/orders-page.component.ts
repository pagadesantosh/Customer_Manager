import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take, map } from 'rxjs/operators';

import { Order, OrderFilters, OrderViewMode } from '../models';
import * as OrderActions from '../store/order.actions';
import * as OrderSelectors from '../store/order.selectors';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <div class="header-content">
          <h1>
            <span class="page-icon">📦</span>
            Orders Management
            <span *ngIf="customerId" class="customer-filter-badge">
              Customer Orders
            </span>
          </h1>
          <p class="page-description">
            <span *ngIf="!customerId">
              Manage and track all customer orders, view order history, and process new orders.
            </span>
            <span *ngIf="customerId">
              Viewing orders for customer ID: {{ customerId }}
            </span>
          </p>
        </div>
        <div class="header-actions">
          <button *ngIf="customerId" 
                  class="btn btn-secondary" 
                  (click)="clearCustomerFilter()">
            <span class="btn-icon">🔄</span>
            View All Orders
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error$ | async as error" class="error-container">
        <div class="error-icon">❌</div>
        <h3>Error Loading Orders</h3>
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="retryLoad()">
          <span class="btn-icon">🔄</span>
          Retry
        </button>
      </div>

      <!-- Orders Content -->
      <div *ngIf="!(loading$ | async) && !(error$ | async)" class="orders-content">
        
        <!-- Filters Section -->
        <div class="filters-section">
          <div class="filter-controls">
            <div class="search-box">
              <input type="text" 
                     placeholder="Search orders by number, customer name, or email..." 
                     [value]="(filters$ | async)?.searchTerm || ''"
                     (input)="onSearchChange($event)"
                     class="search-input">
              <span class="search-icon">🔍</span>
            </div>
            
            <div class="filter-buttons">
              <select (change)="onStatusFilterChange($event)" class="filter-select">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>

              <button class="btn btn-outline" (click)="clearFilters()">
                <span class="btn-icon">🗑️</span>
                Clear Filters
              </button>
            </div>
          </div>

          <div class="view-controls">
            <div class="view-mode-selector">
              <button *ngFor="let mode of viewModes" 
                      [class]="'view-mode-btn ' + (viewMode === mode ? 'active' : '')"
                      (click)="setViewMode(mode)">
                {{ mode | titlecase }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results Summary -->
        <div class="results-summary">
          <span class="results-count">
            {{ (filteredOrders$ | async)?.length || 0 }} orders found
            <span *ngIf="(hasActiveFilters$ | async)" class="filter-indicator">
              (filtered)
            </span>
          </span>
        </div>

        <!-- Orders List -->
        <div class="orders-container" [attr.data-view-mode]="viewMode">
          <div *ngIf="(filteredOrders$ | async)?.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No Orders Found</h3>
            <p *ngIf="hasActiveFilters$ | async">
              Try adjusting your filters to see more results.
            </p>
            <p *ngIf="!(hasActiveFilters$ | async)">
              <span *ngIf="!customerId">No orders have been created yet.</span>
              <span *ngIf="customerId">This customer has no orders yet.</span>
            </p>
          </div>

          <div *ngFor="let order of (paginatedOrders$ | async)" 
               class="order-item"
               (click)="selectOrder(order)">
            <div class="order-header">
              <div class="order-number">
                <strong>{{ order.orderNumber }}</strong>
              </div>
              <div class="order-status">
                <span class="status-badge" [style.background-color]="order.statusColor">
                  {{ order.status | titlecase }}
                </span>
              </div>
            </div>

            <div class="order-details">
              <div class="customer-info">
                <span class="customer-name">{{ order.customerName }}</span>
                <span class="customer-email">{{ order.customerEmail }}</span>
              </div>
              
              <div class="order-meta">
                <div class="order-date">
                  <span class="meta-label">Order Date:</span>
                  <span>{{ order.orderDate | date:'mediumDate' }}</span>
                </div>
                <div class="order-total">
                  <span class="meta-label">Total:</span>
                  <span class="total-amount">\${{ order.total | number:'1.2-2' }}</span>
                </div>
                <div class="order-items">
                  <span class="meta-label">Items:</span>
                  <span>{{ order.itemCount }}</span>
                </div>
              </div>
            </div>

            <div class="order-actions">
              <button class="btn btn-sm btn-primary" (click)="viewOrderDetails(order, $event)">
                View Details
              </button>
              <button *ngIf="order.isEditable" 
                      class="btn btn-sm btn-secondary" 
                      (click)="editOrder(order, $event)">
                Edit
              </button>
              <button *ngIf="order.isCancellable" 
                      class="btn btn-sm btn-danger" 
                      (click)="cancelOrder(order, $event)">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="(currentPageInfo$ | async) as pageInfo" class="pagination-container">
          <div class="pagination-info">
            Showing {{ pageInfo.startItem }}-{{ pageInfo.endItem }} of {{ pageInfo.totalItems }} orders
          </div>
          
          <div class="pagination-controls">
            <button class="btn btn-outline btn-sm" 
                    [disabled]="pageInfo.currentPage <= 1"
                    (click)="previousPage()">
              Previous
            </button>
            
            <span class="page-info">
              Page {{ pageInfo.currentPage }} of {{ pageInfo.totalPages }}
            </span>
            
            <button class="btn btn-outline btn-sm" 
                    [disabled]="pageInfo.currentPage >= pageInfo.totalPages"
                    (click)="nextPage()">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e9ecef;
    }

    .header-content h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 2rem;
    }

    .page-icon {
      font-size: 2rem;
    }

    .customer-filter-badge {
      background: #007bff;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .page-description {
      color: #6c757d;
      margin: 0;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      color: #dc3545;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    .filters-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .filter-controls {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 40px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }

    .filter-buttons {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .filter-select {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
    }

    .view-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .view-mode-selector {
      display: flex;
      background: #f8f9fa;
      border-radius: 6px;
      overflow: hidden;
    }

    .view-mode-btn {
      padding: 8px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-mode-btn.active {
      background: #007bff;
      color: white;
    }

    .results-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 0 4px;
    }

    .results-count {
      color: #6c757d;
      font-size: 14px;
    }

    .filter-indicator {
      color: #007bff;
      font-weight: 500;
    }

    .orders-container {
      display: grid;
      gap: 16px;
    }

    .order-item {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }

    .order-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .order-number {
      font-size: 1.1rem;
      color: #2c3e50;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      color: white;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .order-details {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .customer-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .customer-email {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .order-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .meta-label {
      font-weight: 500;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .total-amount {
      font-weight: 600;
      color: #28a745;
    }

    .order-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.8rem;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid #ddd;
      color: #6c757d;
    }

    .btn-outline:hover {
      background: #f8f9fa;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-icon {
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #6c757d;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 16px;
    }

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .page-info {
      color: #6c757d;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .orders-page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .filter-controls {
        flex-direction: column;
      }

      .search-box {
        min-width: auto;
      }

      .order-details {
        grid-template-columns: 1fr;
      }

      .pagination-container {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class OrdersPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Observable properties
  orders$: Observable<Order[]>;
  filteredOrders$: Observable<Order[]>;
  paginatedOrders$: Observable<Order[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filters$: Observable<OrderFilters>;
  hasActiveFilters$: Observable<boolean>;
  currentPageInfo$: Observable<any>;

  // Component state
  customerId: number | null = null;
  viewMode: OrderViewMode = 'card';
  viewModes: OrderViewMode[] = ['card', 'list', 'timeline'];
  private currentPageInfo: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    // Initialize observables
    this.orders$ = this.store.select(OrderSelectors.selectAllOrders);
    this.filteredOrders$ = this.store.select(OrderSelectors.selectFilteredOrders);
    this.paginatedOrders$ = this.store.select(OrderSelectors.selectPaginatedOrders);
    this.loading$ = this.store.select(OrderSelectors.selectOrderLoading);
    this.error$ = this.store.select(OrderSelectors.selectOrderError);
    this.filters$ = this.store.select(OrderSelectors.selectOrderFilters);
    this.hasActiveFilters$ = this.store.select(OrderSelectors.selectHasActiveFilters);
    this.currentPageInfo$ = this.store.select(OrderSelectors.selectCurrentPageInfo);
  }

  ngOnInit(): void {
    // Check for customer ID in query params
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['customerId']) {
          this.customerId = +params['customerId'];
          this.loadCustomerOrders(this.customerId);
        } else {
          this.customerId = null;
          this.loadAllOrders();
        }
      });

    // Subscribe to page info changes
    this.currentPageInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageInfo => {
        this.currentPageInfo = pageInfo;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data loading methods
  loadAllOrders(): void {
    this.store.dispatch(OrderActions.loadOrders({}));
    // Reset pagination to first page when loading all orders
    this.store.dispatch(OrderActions.setPage({ page: 1 }));
  }

  loadCustomerOrders(customerId: number): void {
    this.store.dispatch(OrderActions.updateFilters({ 
      filters: { customerIds: [customerId] } 
    }));
    this.store.dispatch(OrderActions.loadOrders({}));
    // Reset pagination to first page when loading customer orders
    this.store.dispatch(OrderActions.setPage({ page: 1 }));
  }

  retryLoad(): void {
    this.store.dispatch(OrderActions.clearError());
    if (this.customerId) {
      this.loadCustomerOrders(this.customerId);
    } else {
      this.loadAllOrders();
    }
  }

  // Filter methods
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(OrderActions.updateFilters({
      filters: { searchTerm: target.value }
    }));
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const statuses = target.value ? [target.value as any] : [];
    this.store.dispatch(OrderActions.updateFilters({
      filters: { statuses }
    }));
  }

  clearFilters(): void {
    this.store.dispatch(OrderActions.clearFilters());
    if (this.customerId) {
      // Keep the customer filter
      this.store.dispatch(OrderActions.updateFilters({
        filters: { customerIds: [this.customerId] }
      }));
    }
  }

  clearCustomerFilter(): void {
    this.router.navigate(['/orders']);
  }

  // View mode methods
  setViewMode(mode: OrderViewMode): void {
    this.viewMode = mode;
    this.store.dispatch(OrderActions.setViewMode({ viewMode: mode }));
  }

  // Order action methods
  selectOrder(order: Order): void {
    this.store.dispatch(OrderActions.selectOrder({ order }));
  }

  viewOrderDetails(order: Order, event: Event): void {
    event.stopPropagation();
    // TODO: Navigate to order details page
    console.log('View order details:', order.id);
  }

  editOrder(order: Order, event: Event): void {
    event.stopPropagation();
    // TODO: Open edit order modal or navigate to edit page
    console.log('Edit order:', order.id);
  }

  cancelOrder(order: Order, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
      this.store.dispatch(OrderActions.cancelOrder({ orderId: order.id }));
    }
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPageInfo && this.currentPageInfo.currentPage > 1) {
      this.store.dispatch(OrderActions.setPage({ page: this.currentPageInfo.currentPage - 1 }));
    }
  }

  nextPage(): void {
    if (this.currentPageInfo && this.currentPageInfo.currentPage < this.currentPageInfo.totalPages) {
      this.store.dispatch(OrderActions.setPage({ page: this.currentPageInfo.currentPage + 1 }));
    }
  }

  // Additional pagination methods
  goToPage(page: number): void {
    if (this.currentPageInfo && page >= 1 && page <= this.currentPageInfo.totalPages) {
      this.store.dispatch(OrderActions.setPage({ page }));
    }
  }

  goToFirstPage(): void {
    this.store.dispatch(OrderActions.setPage({ page: 1 }));
  }

  goToLastPage(): void {
    if (this.currentPageInfo && this.currentPageInfo.totalPages > 0) {
      this.store.dispatch(OrderActions.setPage({ page: this.currentPageInfo.totalPages }));
    }
  }

  onPageSizeChange(pageSize: number): void {
    this.store.dispatch(OrderActions.setPageSize({ pageSize }));
  }
}
