import { createFeature } from '@ngrx/store';
import { customerReducer } from './customer.reducer';

export const customerFeature = createFeature({
  name: 'customers',
  reducer: customerReducer
});

export const {
  selectCustomersState,
  selectCustomers,
  selectFilteredCustomers,
  selectFilters,
  selectViewMode,
  selectSelectedCustomerId,
  selectAvailableStates,
  selectAvailableCompanies,
  selectLoading,
  selectLoadingFilterOptions,
  selectError,
  selectFilterOptionsError
} = customerFeature;
