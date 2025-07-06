import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CustomerFilters } from '../models';

@Component({
  selector: 'app-customer-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="filters-container">
      <div class="filters-header">
        <h3>Filters</h3>
        <button class="clear-button" 
                (click)="onClearFilters()"
                [disabled]="!hasActiveFilters">
          Clear All
        </button>
      </div>
      
      <form [formGroup]="filterForm" class="filters-form">
        <!-- Search -->
        <div class="filter-group">
          <label class="filter-label">Search</label>
          <input type="text" 
                 class="filter-input"
                 placeholder="Search customers..."
                 formControlName="searchTerm">
        </div>
        
        <!-- States Filter -->
        <div class="filter-group">
          <label class="filter-label">
            States
            <span class="filter-count" *ngIf="selectedStates.length > 0">
              ({{ selectedStates.length }})
            </span>
          </label>
          <div class="filter-options">
            <div class="filter-option" *ngFor="let state of availableStates">
              <label class="checkbox-label">
                <input type="checkbox" 
                       [checked]="selectedStates.includes(state)"
                       (change)="onStateToggle(state)">
                <span class="checkbox-text">{{ state }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Companies Filter -->
        <div class="filter-group">
          <label class="filter-label">
            Companies
            <span class="filter-count" *ngIf="selectedCompanies.length > 0">
              ({{ selectedCompanies.length }})
            </span>
          </label>
          <div class="filter-options">
            <div class="filter-option" *ngFor="let company of availableCompanies">
              <label class="checkbox-label">
                <input type="checkbox" 
                       [checked]="selectedCompanies.includes(company)"
                       (change)="onCompanyToggle(company)">
                <span class="checkbox-text">{{ company }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Status Filter -->
        <div class="filter-group">
          <label class="filter-label">
            Status
            <span class="filter-count" *ngIf="selectedStatuses.length > 0">
              ({{ selectedStatuses.length }})
            </span>
          </label>
          <div class="filter-options">
            <div class="filter-option" *ngFor="let status of availableStatuses">
              <label class="checkbox-label">
                <input type="checkbox" 
                       [checked]="selectedStatuses.includes(status)"
                       (change)="onStatusToggle(status)">
                <span class="checkbox-text status-text" [class]="'status-' + status">
                  {{ status | titlecase }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>
      
      <!-- Active Filters Summary -->
      <div class="active-filters" *ngIf="hasActiveFilters">
        <h4>Active Filters:</h4>
        <div class="filter-tags">
          <span class="filter-tag" 
                *ngFor="let state of selectedStates"
                (click)="onStateToggle(state)">
            {{ state }} ×
          </span>
          <span class="filter-tag" 
                *ngFor="let company of selectedCompanies"
                (click)="onCompanyToggle(company)">
            {{ company }} ×
          </span>
          <span class="filter-tag" 
                *ngFor="let status of selectedStatuses"
                (click)="onStatusToggle(status)">
            {{ status | titlecase }} ×
          </span>
          <span class="filter-tag" 
                *ngIf="currentFilters.searchTerm"
                (click)="onClearSearch()">
            "{{ currentFilters.searchTerm }}" ×
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      padding: 20px;
      height: fit-content;
      border: 1px solid #e9ecef;
      position: sticky;
      top: 20px;
    }
    
    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 16px 0;
      border-bottom: 2px solid #e9ecef;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      margin: -20px -20px 24px -20px;
      padding: 20px 20px 16px 20px;
      border-radius: 8px 8px 0 0;
    }
    
    .filters-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .filters-header h3::before {
      content: '🔍';
      font-size: 1.1rem;
    }
    
    .clear-button {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
    }
    
    .clear-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);
      transform: translateY(-1px);
    }
    
    .clear-button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    .filters-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .filter-label {
      font-weight: 700;
      color: #343a40;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .filter-count {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      min-width: 22px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
    }
    
    .filter-input {
      padding: 12px 16px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 0.9rem;
      width: 100%;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }
    
    .filter-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15);
      background: white;
      transform: translateY(-1px);
    }
    
    .filter-input::placeholder {
      color: #adb5bd;
    }
    
    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 200px;
      overflow-y: auto;
      padding: 8px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      background: #f8f9fa;
    }
    
    .filter-options::-webkit-scrollbar {
      width: 6px;
    }
    
    .filter-options::-webkit-scrollbar-track {
      background: #f1f3f4;
      border-radius: 3px;
    }
    
    .filter-options::-webkit-scrollbar-thumb {
      background: #c1c8d1;
      border-radius: 3px;
    }
    
    .filter-options::-webkit-scrollbar-thumb:hover {
      background: #a4b0be;
    }
    
    .filter-option {
      display: flex;
      align-items: center;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 10px 14px;
      border-radius: 6px;
      transition: all 0.3s ease;
      width: 100%;
      background: white;
      margin: 2px;
      border: 1px solid transparent;
    }
    
    .checkbox-label:hover {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      transform: translateX(3px);
      border-color: #2196f3;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
    }
    
    .checkbox-label input[type="checkbox"] {
      margin: 0;
      transform: scale(1.2);
      accent-color: #007bff;
      cursor: pointer;
    }
    
    .checkbox-text {
      font-size: 0.9rem;
      color: #343a40;
      font-weight: 500;
      flex: 1;
    }
    
    .status-text.status-active {
      color: #28a745;
      font-weight: 600;
    }
    
    .status-text.status-inactive {
      color: #dc3545;
      font-weight: 600;
    }
    
    .status-text.status-pending {
      color: #ffc107;
      font-weight: 600;
    }
    
    .active-filters {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 2px solid #e9ecef;
    }
    
    .active-filters h4 {
      margin: 0 0 12px 0;
      font-size: 0.9rem;
      color: #6c757d;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .filter-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .filter-tag {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      padding: 6px 10px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
      position: relative;
      overflow: hidden;
    }
    
    .filter-tag::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #dc3545, #c82333);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .filter-tag:hover::before {
      opacity: 1;
    }
    
    .filter-tag:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);
    }
    
    /* Responsive optimizations for sidebar */
    @media (max-width: 1200px) {
      .filters-container {
        padding: 16px;
      }
      
      .filter-options {
        max-height: 160px;
      }
      
      .filters-form {
        gap: 20px;
      }
    }
    
    @media (max-width: 1024px) {
      .filters-container {
        margin-bottom: 20px;
      }
    }
    
    @media (max-width: 768px) {
      .filters-container {
        padding: 16px;
        margin-bottom: 16px;
      }
      
      .filters-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        text-align: center;
      }
      
      .filters-header h3 {
        font-size: 1.1rem;
      }
      
      .clear-button {
        align-self: center;
        width: fit-content;
      }
      
      .filter-options {
        max-height: 140px;
      }
      
      .filters-form {
        gap: 18px;
      }
    }
    
    @media (max-width: 480px) {
      .filters-container {
        padding: 12px;
      }
      
      .filter-tags {
        gap: 6px;
      }
      
      .filter-tag {
        font-size: 0.7rem;
        padding: 4px 8px;
      }
    }
  `]
})
export class CustomerFiltersComponent implements OnInit {
  @Input() currentFilters: CustomerFilters = {
    states: [],
    companies: [],
    statuses: [],
    searchTerm: ''
  };
  
  @Input() availableStates: string[] = [];
  @Input() availableCompanies: string[] = [];
  @Input() loading = false;
  
  @Output() filtersChange = new EventEmitter<Partial<CustomerFilters>>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() stateToggle = new EventEmitter<string>();
  @Output() companyToggle = new EventEmitter<string>();
  @Output() statusToggle = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  filterForm!: FormGroup;
  availableStatuses = ['active', 'inactive', 'pending'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      searchTerm: [this.currentFilters.searchTerm]
    });
  }

  private setupFormSubscriptions(): void {
    // Subscribe to search term changes with debounce
    this.filterForm.get('searchTerm')?.valueChanges.subscribe((searchTerm: string) => {
      this.searchTermChange.emit(searchTerm || '');
    });
  }

  get selectedStates(): string[] {
    return this.currentFilters.states;
  }

  get selectedCompanies(): string[] {
    return this.currentFilters.companies;
  }

  get selectedStatuses(): string[] {
    return this.currentFilters.statuses;
  }

  get hasActiveFilters(): boolean {
    return this.selectedStates.length > 0 ||
           this.selectedCompanies.length > 0 ||
           this.selectedStatuses.length > 0 ||
           !!this.currentFilters.searchTerm.trim();
  }

  onStateToggle(state: string): void {
    this.stateToggle.emit(state);
  }

  onCompanyToggle(company: string): void {
    this.companyToggle.emit(company);
  }

  onStatusToggle(status: string): void {
    this.statusToggle.emit(status);
  }

  onClearFilters(): void {
    this.filterForm.patchValue({ searchTerm: '' });
    this.clearFilters.emit();
  }

  onClearSearch(): void {
    this.filterForm.patchValue({ searchTerm: '' });
    this.searchTermChange.emit('');
  }
}
