import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer, CustomerFilters, ViewMode } from '../models';

export const CustomerActions = createActionGroup({
  source: 'Customer',
  events: {
    // Load customers
    'Load Customers': emptyProps(),
    'Load Customers Success': props<{ customers: Customer[] }>(),
    'Load Customers Failure': props<{ error: string }>(),

    // Filter actions
    'Update Filters': props<{ filters: Partial<CustomerFilters> }>(),
    'Clear Filters': emptyProps(),
    'Set Search Term': props<{ searchTerm: string }>(),
    'Toggle State Filter': props<{ state: string }>(),
    'Toggle Company Filter': props<{ company: string }>(),
    'Toggle Status Filter': props<{ status: string }>(),

    // View mode actions
    'Switch View Mode': props<{ viewMode: ViewMode }>(),

    // Customer selection
    'Select Customer': props<{ customerId: number }>(),
    'Clear Selection': emptyProps(),

    // Load filter options
    'Load Filter Options': emptyProps(),
    'Load Filter Options Success': props<{ 
      states: string[], 
      companies: string[] 
    }>(),
    'Load Filter Options Failure': props<{ error: string }>(),

    // Customer CRUD operations
    'Add Customer': props<{ customer: Partial<Customer> }>(),
    'Add Customer Success': props<{ customer: Customer }>(),
    'Add Customer Failure': props<{ error: string }>(),
    
    'Update Customer': props<{ customer: Customer }>(),
    'Update Customer Success': props<{ customer: Customer }>(),
    'Update Customer Failure': props<{ error: string }>(),
    
    'Delete Customer': props<{ customerId: number }>(),
    'Delete Customer Success': props<{ customerId: number }>(),
    'Delete Customer Failure': props<{ error: string }>()
  }
});
