import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { CustomerApiService } from '../services/customer-api.service';
import { CustomerActions } from './customer.actions';

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private customerApiService = inject(CustomerApiService);

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(() =>
        this.customerApiService.getCustomers().pipe(
          map(customers => CustomerActions.loadCustomersSuccess({ customers })),
          catchError(error => of(CustomerActions.loadCustomersFailure({ 
            error: error.message || 'Failed to load customers' 
          })))
        )
      )
    )
  );

  loadFilterOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadFilterOptions),
      switchMap(() =>
        this.customerApiService.getUniqueStates().pipe(
          switchMap(states =>
            this.customerApiService.getUniqueCompanies().pipe(
              map(companies => CustomerActions.loadFilterOptionsSuccess({ 
                states, 
                companies 
              })),
              catchError(error => of(CustomerActions.loadFilterOptionsFailure({ 
                error: error.message || 'Failed to load filter options' 
              })))
            )
          ),
          catchError(error => of(CustomerActions.loadFilterOptionsFailure({ 
            error: error.message || 'Failed to load filter options' 
          })))
        )
      )
    )
  );

  addCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.addCustomer),
      mergeMap(action =>
        this.customerApiService.addCustomer(action.customer).pipe(
          map(customer => CustomerActions.addCustomerSuccess({ customer })),
          catchError(error => of(CustomerActions.addCustomerFailure({ 
            error: error.message || 'Failed to add customer' 
          })))
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      mergeMap(action =>
        this.customerApiService.updateCustomer(action.customer).pipe(
          map(customer => CustomerActions.updateCustomerSuccess({ customer })),
          catchError(error => of(CustomerActions.updateCustomerFailure({ 
            error: error.message || 'Failed to update customer' 
          })))
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      mergeMap(action =>
        this.customerApiService.deleteCustomer(action.customerId).pipe(
          map(() => CustomerActions.deleteCustomerSuccess({ customerId: action.customerId })),
          catchError(error => of(CustomerActions.deleteCustomerFailure({ 
            error: error.message || 'Failed to delete customer' 
          })))
        )
      )
    )
  );
}
