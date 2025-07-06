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
}
