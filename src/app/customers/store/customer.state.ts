import { Customer, CustomerFilters, ViewMode } from '../models';

export interface CustomerState {
  customers: Customer[];
  filteredCustomers: Customer[];
  filters: CustomerFilters;
  viewMode: ViewMode;
  selectedCustomerId: number | null;
  
  // Filter options
  availableStates: string[];
  availableCompanies: string[];
  
  // Loading states
  loading: boolean;
  loadingFilterOptions: boolean;
  
  // Error states
  error: string | null;
  filterOptionsError: string | null;
}

export const initialCustomerState: CustomerState = {
  customers: [],
  filteredCustomers: [],
  filters: {
    states: [],
    companies: [],
    statuses: [],
    searchTerm: ''
  },
  viewMode: 'card',
  selectedCustomerId: null,
  
  availableStates: [],
  availableCompanies: [],
  
  loading: false,
  loadingFilterOptions: false,
  
  error: null,
  filterOptionsError: null
};
