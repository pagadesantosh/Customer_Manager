import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { OrderApiService } from '../services/order-api.service';
import { OrderFilters, Order } from '../models';
import * as OrderActions from './order.actions';
import { selectOrderFilters } from '.';

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private orderApiService = inject(OrderApiService);
  private store = inject(Store);

  constructor() {}

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      switchMap(action =>
        this.orderApiService.getOrders(action.filters).pipe(
          map(orders => OrderActions.loadOrdersSuccess({ orders })),
          catchError(error => of(OrderActions.loadOrdersFailure({ error: error.message })))
        )
      )
    )
  );

  loadCustomerOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadCustomerOrders),
      switchMap(action =>
        this.orderApiService.getOrdersByCustomer(action.customerId).pipe(
          map(orders => OrderActions.loadCustomerOrdersSuccess({ 
            customerId: action.customerId, 
            orders 
          })),
          catchError(error => of(OrderActions.loadCustomerOrdersFailure({ error: error.message })))
        )
      )
    )
  );

  loadOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrder),
      switchMap(action =>
        this.orderApiService.getOrderById(action.orderId).pipe(
          map(order => OrderActions.loadOrderSuccess({ order })),
          catchError(error => of(OrderActions.loadOrderFailure({ error: error.message })))
        )
      )
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      switchMap(action =>
        this.orderApiService.createOrder(action.order).pipe(
          map(order => OrderActions.createOrderSuccess({ order })),
          catchError(error => of(OrderActions.createOrderFailure({ error: error.message })))
        )
      )
    )
  );

  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrder),
      switchMap(action =>
        this.orderApiService.updateOrder(action.orderId, action.order).pipe(
          map(order => OrderActions.updateOrderSuccess({ order })),
          catchError(error => of(OrderActions.updateOrderFailure({ error: error.message })))
        )
      )
    )
  );

  cancelOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.cancelOrder),
      switchMap(action =>
        this.orderApiService.cancelOrder(action.orderId).pipe(
          map(order => OrderActions.cancelOrderSuccess({ order })),
          catchError(error => of(OrderActions.cancelOrderFailure({ error: error.message })))
        )
      )
    )
  );

  applyFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.applyFilters),
      withLatestFrom(this.store.select(selectOrderFilters)),
      switchMap(([, filters]) =>
        this.orderApiService.getOrders(filters as OrderFilters).pipe(
          map(orders => OrderActions.loadOrdersSuccess({ orders })),
          catchError(error => of(OrderActions.loadOrdersFailure({ error: error.message })))
        )
      )
    )
  );

  // Effect to enrich order data with customer information
  enrichOrderWithCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrderSuccess),
      switchMap(action => {
        const order = action.order;
        return this.orderApiService.getCustomerById(order.customerId).pipe(
          map(customer => {
            if (customer) {
              // Create a new Order instance to preserve getters and methods
              const enrichedOrder = Object.assign(new Order(), {
                ...order,
                customerName: `${customer.firstName} ${customer.lastName}`,
                customerEmail: customer.email,
                customerPhone: customer.phone
              });
              return OrderActions.updateOrderSuccess({ order: enrichedOrder });
            }
            return OrderActions.loadOrderSuccess({ order });
          }),
          catchError(() => of(OrderActions.loadOrderSuccess({ order })))
        );
      })
    )
  );
}
