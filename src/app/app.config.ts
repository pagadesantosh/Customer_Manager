import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { customerFeature } from './customers/store/customer.feature';
import { CustomerEffects } from './customers/store/customer.effects';
import { orderFeature } from './orders/store/order.feature';
import { OrderEffects } from './orders/store/order.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      [customerFeature.name]: customerFeature.reducer,
      [orderFeature.name]: orderFeature.reducer
    }),
    provideEffects([CustomerEffects, OrderEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
