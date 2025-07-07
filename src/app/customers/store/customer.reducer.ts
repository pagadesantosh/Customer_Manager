import { createReducer, on } from '@ngrx/store';
import { CustomerActions } from './customer.actions';
import { CustomerState, initialCustomerState } from './customer.state';
import { Customer } from '../models';

function applyFilters(customers: Customer[], filters: typeof initialCustomerState.filters): Customer[] {
  return customers.filter(customer => {
    // State filter
    if (filters.states.length > 0 && !filters.states.includes(customer.state)) {
      return false;
    }

    // Company filter
    if (filters.companies.length > 0 && !filters.companies.includes(customer.company)) {
      return false;
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(customer.status)) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      return (
        customer.fullName.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.company.toLowerCase().includes(searchTerm) ||
        customer.city.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
}

export const customerReducer = createReducer(
  initialCustomerState,

  // Load customers
  on(CustomerActions.loadCustomers, (state): CustomerState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.loadCustomersSuccess, (state, { customers }): CustomerState => {
    const filteredCustomers = applyFilters(customers, state.filters);
    return {
      ...state,
      customers,
      filteredCustomers,
      loading: false,
      error: null
    };
  }),

  on(CustomerActions.loadCustomersFailure, (state, { error }): CustomerState => ({
    ...state,
    loading: false,
    error
  })),

  // Update filters
  on(CustomerActions.updateFilters, (state, { filters }): CustomerState => {
    const newFilters = { ...state.filters, ...filters };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.clearFilters, (state): CustomerState => {
    const clearedFilters = {
      states: [],
      companies: [],
      statuses: [],
      searchTerm: ''
    };
    return {
      ...state,
      filters: clearedFilters,
      filteredCustomers: state.customers
    };
  }),

  on(CustomerActions.setSearchTerm, (state, { searchTerm }): CustomerState => {
    const newFilters = { ...state.filters, searchTerm };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.toggleStateFilter, (state, { state: stateToToggle }): CustomerState => {
    const currentStates = state.filters.states;
    const newStates = currentStates.includes(stateToToggle)
      ? currentStates.filter(s => s !== stateToToggle)
      : [...currentStates, stateToToggle];
    
    const newFilters = { ...state.filters, states: newStates };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.toggleCompanyFilter, (state, { company }): CustomerState => {
    const currentCompanies = state.filters.companies;
    const newCompanies = currentCompanies.includes(company)
      ? currentCompanies.filter(c => c !== company)
      : [...currentCompanies, company];
    
    const newFilters = { ...state.filters, companies: newCompanies };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  on(CustomerActions.toggleStatusFilter, (state, { status }): CustomerState => {
    const currentStatuses = state.filters.statuses;
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    const newFilters = { ...state.filters, statuses: newStatuses };
    const filteredCustomers = applyFilters(state.customers, newFilters);
    
    return {
      ...state,
      filters: newFilters,
      filteredCustomers
    };
  }),

  // View mode
  on(CustomerActions.switchViewMode, (state, { viewMode }): CustomerState => ({
    ...state,
    viewMode
  })),

  // Customer selection
  on(CustomerActions.selectCustomer, (state, { customerId }): CustomerState => ({
    ...state,
    selectedCustomerId: customerId
  })),

  on(CustomerActions.clearSelection, (state): CustomerState => ({
    ...state,
    selectedCustomerId: null
  })),

  // Filter options
  on(CustomerActions.loadFilterOptions, (state): CustomerState => ({
    ...state,
    loadingFilterOptions: true,
    filterOptionsError: null
  })),

  on(CustomerActions.loadFilterOptionsSuccess, (state, { states, companies }): CustomerState => ({
    ...state,
    availableStates: states,
    availableCompanies: companies,
    loadingFilterOptions: false,
    filterOptionsError: null
  })),

  on(CustomerActions.loadFilterOptionsFailure, (state, { error }): CustomerState => ({
    ...state,
    loadingFilterOptions: false,
    filterOptionsError: error
  })),

  // Add customer
  on(CustomerActions.addCustomer, (state): CustomerState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.addCustomerSuccess, (state, { customer }): CustomerState => {
    const updatedCustomers = [...state.customers, customer];
    const filteredCustomers = applyFilters(updatedCustomers, state.filters);
    return {
      ...state,
      customers: updatedCustomers,
      filteredCustomers,
      loading: false,
      error: null
    };
  }),

  on(CustomerActions.addCustomerFailure, (state, { error }): CustomerState => ({
    ...state,
    loading: false,
    error
  })),

  // Update customer
  on(CustomerActions.updateCustomer, (state): CustomerState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.updateCustomerSuccess, (state, { customer }): CustomerState => {
    const updatedCustomers = state.customers.map(c => 
      c.id === customer.id ? customer : c
    );
    const filteredCustomers = applyFilters(updatedCustomers, state.filters);
    return {
      ...state,
      customers: updatedCustomers,
      filteredCustomers,
      loading: false,
      error: null
    };
  }),

  on(CustomerActions.updateCustomerFailure, (state, { error }): CustomerState => ({
    ...state,
    loading: false,
    error
  })),

  // Delete customer
  on(CustomerActions.deleteCustomer, (state): CustomerState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerActions.deleteCustomerSuccess, (state, { customerId }): CustomerState => {
    const updatedCustomers = state.customers.filter(c => c.id !== customerId);
    const filteredCustomers = applyFilters(updatedCustomers, state.filters);
    return {
      ...state,
      customers: updatedCustomers,
      filteredCustomers,
      loading: false,
      error: null,
      selectedCustomerId: state.selectedCustomerId === customerId ? null : state.selectedCustomerId
    };
  }),

  on(CustomerActions.deleteCustomerFailure, (state, { error }): CustomerState => ({
    ...state,
    loading: false,
    error
  }))
);
