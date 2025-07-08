import { createFeature } from '@ngrx/store';
import { orderReducer } from './order.reducer';

export const orderFeature = createFeature({
  name: 'orders',
  reducer: orderReducer
});
