import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../models';

@Component({
  selector: 'app-customer-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Customer' : 'Add New Customer' }}</h2>
          <button type="button" class="close-button" (click)="onClose()">
            <span>&times;</span>
          </button>
        </div>
        
        <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                class="form-control"
                [class.error]="isFieldInvalid('firstName')"
                placeholder="Enter first name">
              <div class="error-message" *ngIf="isFieldInvalid('firstName')">
                First name is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                class="form-control"
                [class.error]="isFieldInvalid('lastName')"
                placeholder="Enter last name">
              <div class="error-message" *ngIf="isFieldInvalid('lastName')">
                Last name is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control"
                [class.error]="isFieldInvalid('email')"
                placeholder="Enter email address">
              <div class="error-message" *ngIf="isFieldInvalid('email')">
                <span *ngIf="customerForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="customerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                formControlName="phone"
                class="form-control"
                placeholder="Enter phone number">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="company">Company *</label>
              <input
                type="text"
                id="company"
                formControlName="company"
                class="form-control"
                [class.error]="isFieldInvalid('company')"
                placeholder="Enter company name">
              <div class="error-message" *ngIf="isFieldInvalid('company')">
                Company is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                formControlName="jobTitle"
                class="form-control"
                placeholder="Enter job title">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="city">City</label>
              <input
                type="text"
                id="city"
                formControlName="city"
                class="form-control"
                placeholder="Enter city">
            </div>
            
            <div class="form-group">
              <label for="state">State</label>
              <input
                type="text"
                id="state"
                formControlName="state"
                class="form-control"
                placeholder="Enter state">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="address">Address</label>
              <input
                type="text"
                id="address"
                formControlName="address"
                class="form-control"
                placeholder="Enter address">
            </div>
            
            <div class="form-group">
              <label for="zipCode">Zip Code</label>
              <input
                type="text"
                id="zipCode"
                formControlName="zipCode"
                class="form-control"
                placeholder="Enter zip code">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="status">Status *</label>
              <select
                id="status"
                formControlName="status"
                class="form-control"
                [class.error]="isFieldInvalid('status')">
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <div class="error-message" *ngIf="isFieldInvalid('status')">
                Status is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="revenue">Revenue</label>
              <input
                type="number"
                id="revenue"
                formControlName="revenue"
                class="form-control"
                placeholder="Enter revenue amount"
                step="0.01"
                min="0">
            </div>
          </div>
          
          <div class="form-group">
            <label for="avatarUrl">Avatar URL</label>
            <input
              type="url"
              id="avatarUrl"
              formControlName="avatarUrl"
              class="form-control"
              placeholder="Enter avatar image URL">
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea
              id="notes"
              formControlName="notes"
              class="form-control"
              rows="3"
              placeholder="Enter any additional notes">
            </textarea>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onClose()">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="customerForm.invalid || isLoading">
              <span *ngIf="isLoading" class="loading-spinner"></span>
              {{ isEditMode ? 'Update Customer' : 'Add Customer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }
    
    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalSlideIn 0.3s ease-out;
    }
    
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
      font-weight: 600;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6c757d;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .close-button:hover {
      background: #f8f9fa;
      color: #495057;
    }
    
    .modal-form {
      padding: 24px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 6px;
      font-size: 0.9rem;
    }
    
    .form-control {
      padding: 10px 12px;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      background: #fff;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
    
    .form-control.error {
      border-color: #dc3545;
    }
    
    .form-control.error:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.8rem;
      margin-top: 4px;
    }
    
    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
      margin-top: 24px;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 20px;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .modal-header,
      .modal-form {
        padding: 16px;
      }
    }
  `]
})
export class CustomerFormModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() customer: Customer | null = null;
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Customer>>();

  customerForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'] && this.customerForm) {
      this.isEditMode = !!this.customer;
      this.updateFormValues();
    }
  }

  private initializeForm(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: ['', [Validators.required]],
      jobTitle: [''],
      city: [''],
      state: [''],
      address: [''],
      zipCode: [''],
      status: ['', [Validators.required]],
      revenue: [0, [Validators.min(0)]],
      avatarUrl: [''],
      notes: ['']
    });
  }

  private updateFormValues(): void {
    if (this.customer) {
      this.customerForm.patchValue({
        firstName: this.customer.firstName,
        lastName: this.customer.lastName,
        email: this.customer.email,
        phone: this.customer.phone,
        company: this.customer.company,
        jobTitle: this.customer.jobTitle,
        city: this.customer.city,
        state: this.customer.state,
        address: this.customer.address,
        zipCode: this.customer.zipCode,
        status: this.customer.status,
        revenue: this.customer.revenue,
        avatarUrl: this.customer.avatarUrl,
        notes: this.customer.notes
      });
    } else {
      this.customerForm.reset();
      this.customerForm.patchValue({
        revenue: 0,
        status: ''
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;
      
      // If editing, include the ID
      const customerData = this.isEditMode 
        ? { ...formValue, id: this.customer!.id }
        : formValue;

      // Add default dates if creating new customer
      if (!this.isEditMode) {
        customerData.registrationDate = new Date();
        customerData.lastLogin = new Date();
      }

      this.save.emit(customerData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.customerForm.controls).forEach(key => {
        this.customerForm.get(key)?.markAsTouched();
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
