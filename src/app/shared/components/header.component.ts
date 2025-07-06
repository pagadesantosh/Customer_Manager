import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, takeUntil } from 'rxjs';
import { CustomerActions } from '../../customers/store';
import * as CustomerSelectors from '../../customers/store/customer.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="main-header">
      <!-- Top Navigation Bar -->
      <nav class="top-nav">
        <div class="nav-container">
          <!-- Brand Section -->
          <div class="brand-section">
            <div class="brand-icon">
              <span class="icon-customers">👥</span>
            </div>
            <h1 class="brand-title">Customer Manager</h1>
          </div>
          
          <!-- Navigation Menu -->
          <div class="nav-menu">
            <a routerLink="/customers" routerLinkActive="active" class="nav-item">Customers</a>
            <a routerLink="/orders" routerLinkActive="active" class="nav-item">Orders</a>
            <a routerLink="/about" routerLinkActive="active" class="nav-item">About</a>
            <a routerLink="/login" routerLinkActive="active" class="nav-item">Login</a>
          </div>
        </div>
      </nav>
      
      <!-- Page Header -->
      <div class="page-header" *ngIf="showPageHeader">
        <div class="page-header-container">
          <div class="page-title-section">
            <span class="page-icon">👤</span>
            <h2 class="page-title">Customers</h2>
          </div>
          
          <!-- Action Buttons -->
          <div class="header-actions">
            <button class="view-toggle" [class.active]="currentView === 'card'" (click)="setView('card')">
              <span class="toggle-icon">⊞</span>
              Card View
            </button>
            <button class="view-toggle" [class.active]="currentView === 'list'" (click)="setView('list')">
              <span class="toggle-icon">☰</span>
              List View
            </button>
            <button class="view-toggle" [class.active]="currentView === 'map'" (click)="setView('map')">
              <span class="toggle-icon">🗺</span>
              Map View
            </button>
            <button class="new-customer-btn">
              <span class="btn-icon">+</span>
              New Customer
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .main-header {
      background: linear-gradient(135deg, #2196F3, #1976D2);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    /* Top Navigation */
    .top-nav {
      background: inherit;
      padding: 0;
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
    }
    
    .brand-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .brand-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .icon-customers {
      font-size: 20px;
      filter: brightness(0) invert(1);
    }
    
    .brand-title {
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .nav-menu {
      display: flex;
      gap: 4px;
    }
    
    .nav-item {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .nav-item.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    /* Page Header */
    .page-header {
      background: rgba(255, 255, 255, 0.95);
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }
    
    .page-header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }
    
    .page-title-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .page-icon {
      font-size: 24px;
      color: #2196F3;
    }
    
    .page-title {
      color: #2c3e50;
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .view-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      color: #6c757d;
      transition: all 0.2s ease;
    }
    
    .view-toggle:hover {
      background: #e9ecef;
      color: #495057;
      transform: translateY(-1px);
    }
    
    .view-toggle.active {
      background: #2196F3;
      color: white;
      border-color: #1976D2;
      box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
    }
    
    .toggle-icon {
      font-size: 14px;
    }
    
    .new-customer-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      margin-left: 8px;
    }
    
    .new-customer-btn:hover {
      background: #45a049;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
    }
    
    .btn-icon {
      font-size: 16px;
      font-weight: bold;
    }
    
    /* Responsive Design */
    @media (max-width: 1024px) {
      .nav-container,
      .page-header-container {
        padding: 12px 16px;
      }
      
      .header-actions {
        gap: 6px;
      }
      
      .view-toggle {
        padding: 6px 10px;
        font-size: 0.8rem;
      }
      
      .new-customer-btn {
        padding: 8px 12px;
        font-size: 0.85rem;
      }
    }
    
    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 12px;
        padding: 12px 16px;
      }
      
      .nav-menu {
        gap: 2px;
      }
      
      .nav-item {
        padding: 6px 12px;
        font-size: 0.9rem;
      }
      
      .page-header-container {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .page-title-section {
        justify-content: center;
      }
      
      .header-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
    
    @media (max-width: 480px) {
      .brand-title {
        font-size: 1.3rem;
      }
      
      .page-title {
        font-size: 1.2rem;
      }
      
      .view-toggle {
        flex: 1;
        justify-content: center;
        min-width: 80px;
      }
      
      .new-customer-btn {
        width: 100%;
        justify-content: center;
        margin-left: 0;
        margin-top: 8px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentView: 'card' | 'list' | 'map' = 'card';
  showPageHeader = false;
  private destroy$ = new Subject<void>();
  
  constructor(
    private router: Router,
    private store: Store
  ) {}
  
  ngOnInit(): void {
    // Check initial route
    this.checkRoute(this.router.url);
    
    // Listen to route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.url);
      });

    // Subscribe to current view mode from store
    this.store.select(CustomerSelectors.selectViewMode)
      .pipe(takeUntil(this.destroy$))
      .subscribe(viewMode => {
        this.currentView = viewMode;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private checkRoute(url: string): void {
    // Show page header only on customers page
    this.showPageHeader = url === '/customers' || url === '/';
  }
  
  setView(view: 'card' | 'list' | 'map'): void {
    this.currentView = view;
    // Dispatch action to update view mode in store
    this.store.dispatch(CustomerActions.switchViewMode({ viewMode: view }));
  }
}
