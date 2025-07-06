# 🏗️ Development Plan for Angular Customer Manager

## Table of Contents
- [Component Model Architecture](#a-component-model-architecture)
- [Data Flow Architecture for Filtering](#b-data-flow-architecture-for-filtering)
- [State Management](#c-state-management)
- [Technical Implementation](#technical-implementation)
- [Features Overview](#features-overview)

---

## a) Component Model Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           App Component                         │
│                      (app.component.ts)                        │
├─────────────────────────────────────────────────────────────────┤
│                      Header Component                           │
│                   (header.component.ts)                        │
│        [Navigation Tabs + View Mode Toggle Buttons]            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         Router Outlet                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Customers Page Component                      │ │
│  │              (customers-page.component.ts)                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │           Customer Container Component                  │ │ │
│  │  │         (customer-container.component.ts)              │ │ │
│  │  │                                                         │ │ │
│  │  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │ │ │
│  │  │  │   Filters       │  │        View Components          │ │ │ │
│  │  │  │   Sidebar       │  │                                 │ │ │ │
│  │  │  │                 │  │  ┌─────────────────────────────┐ │ │ │ │
│  │  │  │ Customer        │  │  │    Customer Card View       │ │ │ │ │
│  │  │  │ Filters         │  │  │ (customer-card.component)   │ │ │ │ │
│  │  │  │ Component       │  │  └─────────────────────────────┘ │ │ │ │
│  │  │  │                 │  │                                 │ │ │ │
│  │  │  │ [Search Input]  │  │  ┌─────────────────────────────┐ │ │ │ │
│  │  │  │ [State Filter]  │  │  │    Customer List View       │ │ │ │ │
│  │  │  │ [Company Filter]│  │  │ (customer-list.component)   │ │ │ │ │
│  │  │  │ [Status Filter] │  │  └─────────────────────────────┘ │ │ │ │
│  │  │  │                 │  │                                 │ │ │ │
│  │  │  └─────────────────┘  │  ┌─────────────────────────────┐ │ │ │ │
│  │  │                       │  │    Customer Map View        │ │ │ │ │
│  │  │                       │  │ (customer-map.component)    │ │ │ │ │
│  │  │                       │  │                             │ │ │ │ │
│  │  │                       │  │ [Leaflet Map Integration]   │ │ │ │ │
│  │  │                       │  │ [Geographic Markers]        │ │ │ │ │
│  │  │                       │  │ [Customer Info Overlay]     │ │ │ │ │
│  │  │                       │  └─────────────────────────────┘ │ │ │ │
│  │  │                       └─────────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Other Route Components:                                        │
│  • Orders Page Component (orders-page.component.ts)            │
│  • About Page Component (about-page.component.ts)              │
│  • Login Page Component (login-page.component.ts)              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         Services Layer                         │
├─────────────────────────────────────────────────────────────────┤
│ • CustomerApiService (API communication)                       │
│ • GeocodingService (coordinate generation)                     │
│ • CustomerQueryBuilderService (filtering logic)                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      NgRx Store Layer                          │
├─────────────────────────────────────────────────────────────────┤
│ • Customer State (customers, filters, viewMode, loading)       │
│ • Customer Actions (load, filter, switchView, select)          │
│ • Customer Effects (API calls, side effects)                   │
│ • Customer Selectors (derived state, memoization)              │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### **1. App Component** (`app.component.ts`)
- Root application component
- Contains router outlet for page navigation
- Includes global header component

#### **2. Header Component** (`header.component.ts`)
- Global navigation (Customers, Orders, About, Login)
- View mode toggle buttons (Card/List/Map/New Customer)
- Connected to NgRx store for view mode state

#### **3. Customer Container Component** (`customer-container.component.ts`)
- Smart component managing customer data flow
- Subscribes to NgRx store for customer state
- Orchestrates communication between filters and views
- Handles view mode switching logic

#### **4. Customer Filters Component** (`customer-filters.component.ts`)
- Sidebar filter controls
- Search input, state/company/status dropdowns
- Dispatches filter actions to NgRx store
- Displays available filter options dynamically

#### **5. View Components**
- **Customer Card Component**: Grid layout with customer cards
- **Customer List Component**: Table layout with sorting/pagination
- **Customer Map Component**: Interactive Leaflet map with markers

---

## b) Data Flow Architecture for Filtering

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW DIAGRAM                       │
└─────────────────────────────────────────────────────────────────┘

User Input (Filters)
        │
        ▼
┌─────────────────┐    dispatch    ┌─────────────────┐
│ Customer        │ ──────────────▶│ NgRx Store      │
│ Filters         │  FilterAction  │                 │
│ Component       │                │ • updateFilters │
└─────────────────┘                │ • loadCustomers │
        │                          └─────────────────┘
        │                                   │
        │ User Events:                      │ State Changes
        │ • searchTerm                      │
        │ • selectedStates                 │
        │ • selectedCompanies              ▼
        │ • selectedStatuses        ┌─────────────────┐
        │                           │ Customer        │
        ▼                           │ Effects         │
┌─────────────────┐                │                 │
│ Filter State    │                │ • API Calls     │
│                 │                │ • Side Effects  │
│ {               │                └─────────────────┘
│   searchTerm,   │                         │
│   states: [],   │                         │
│   companies:[],▲│                         ▼
│   statuses: [] ││                ┌─────────────────┐
│ }              ││                │ CustomerApi     │
└────────────────┘│                │ Service         │
        │         │                │                 │
        │         │                │ • HTTP Requests │
        │    State Update           │ • Data Transform│
        │         │                │ • Error Handle  │
        ▼         │                └─────────────────┘
┌─────────────────┐                         │
│ Customer        │                         │
│ Selectors       │                         ▼
│                 │                ┌─────────────────┐
│ • filteredData  │                │ Raw Customer    │
│ • viewMode      │                │ Data            │
│ • isLoading     │◀───────────────│                 │
│ • totalCount    │  Selector      │ Customer[]      │
└─────────────────┘  Computation   └─────────────────┘
        │
        │ Observable Data
        │
        ▼
┌─────────────────┐
│ Customer        │
│ Container       │
│ Component       │
│                 │
│ • Subscribe to  │
│   filtered data │
│ • Pass to views │
└─────────────────┘
        │
        │ Props/Input
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Customer Card   │    │ Customer List   │    │ Customer Map    │
│ Component       │    │ Component       │    │ Component       │
│                 │    │                 │    │                 │
│ • Display cards │    │ • Display table │    │ • Display map   │
│ • Handle events │    │ • Sort/paginate │    │ • Show markers  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow Process

1. **User Interaction**: User types in search or selects filter options
2. **Action Dispatch**: Component dispatches filter action to store
3. **State Update**: Reducer updates filter state immutably
4. **Selector Computation**: Memoized selectors compute filtered results
5. **Component Update**: Components receive new data via observables
6. **View Rendering**: UI updates with filtered customer data

---

## c) State Management

### State Structure

```typescript
interface CustomerState {
  // Core Data
  customers: Customer[];
  selectedCustomer: Customer | null;
  
  // Filter State
  filters: {
    searchTerm: string;
    selectedStates: string[];
    selectedCompanies: string[];
    selectedStatuses: string[];
  };
  
  // UI State
  viewMode: 'card' | 'list' | 'map';
  isLoading: boolean;
  error: string | null;
  
  // Pagination & Sorting
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
  };
  
  sorting: {
    field: string;
    direction: 'asc' | 'desc';
  };
}
```

### NgRx Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NgRx STATE MANAGEMENT                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐                              ┌─────────────────┐
│   ACTIONS       │                              │    SELECTORS    │
│                 │                              │                 │
│ • loadCustomers │                              │ • selectAll     │
│ • updateFilters │                              │ • selectFiltered│
│ • switchViewMode│              STORE           │ • selectLoading │
│ • selectCustomer│         ┌─────────────────┐  │ • selectViewMode│
│ • clearFilters  │         │                 │  │ • selectError   │
│ • sortCustomers │ ──────▶ │  Customer State │ ──▶ • selectCounts  │
│ • updateSearch  │ Actions │                 │  │ • selectPaginated│
└─────────────────┘         │ • customers[]   │  └─────────────────┘
         │                  │ • filters{}     │           │
         │                  │ • viewMode      │           │
         ▼                  │ • isLoading     │           ▼
┌─────────────────┐         │ • error         │  ┌─────────────────┐
│    EFFECTS      │         └─────────────────┘  │   COMPONENTS    │
│                 │                  │           │                 │
│ • loadCustomers$│◀─────────────────┘           │ • Subscribe to  │
│ • searchCustomers$                             │   observables   │
│ • errorHandling$│                              │ • Dispatch      │
│ • apiCalls$     │                              │   actions       │
└─────────────────┘                              │ • Handle events │
         │                                       └─────────────────┘
         │ Side Effects
         ▼
┌─────────────────┐
│    SERVICES     │
│                 │
│ • CustomerApi   │
│ • Geocoding     │
│ • QueryBuilder  │
└─────────────────┘
```

### Key Actions

```typescript
// Customer Actions
export const loadCustomers = createAction('[Customer] Load Customers');
export const loadCustomersSuccess = createAction(
  '[Customer] Load Customers Success',
  props<{ customers: Customer[] }>()
);

// Filter Actions
export const updateSearchTerm = createAction(
  '[Customer] Update Search Term',
  props<{ searchTerm: string }>()
);

export const updateStateFilter = createAction(
  '[Customer] Update State Filter',
  props<{ states: string[] }>()
);

// View Mode Actions
export const switchViewMode = createAction(
  '[Customer] Switch View Mode',
  props<{ viewMode: ViewMode }>()
);
```

### Key Selectors

```typescript
// Basic Selectors
export const selectCustomerState = createFeatureSelector<CustomerState>('customers');
export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state) => state.customers
);

// Filter Selectors with Memoization
export const selectFilteredCustomers = createSelector(
  selectAllCustomers,
  selectFilters,
  (customers, filters) => {
    return customers.filter(customer => {
      // Search term filter
      const matchesSearch = !filters.searchTerm || 
        customer.fullName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // State filter
      const matchesState = filters.selectedStates.length === 0 || 
        filters.selectedStates.includes(customer.state);
      
      // Company filter
      const matchesCompany = filters.selectedCompanies.length === 0 || 
        filters.selectedCompanies.includes(customer.company);
      
      // Status filter
      const matchesStatus = filters.selectedStatuses.length === 0 || 
        filters.selectedStatuses.includes(customer.status);
      
      return matchesSearch && matchesState && matchesCompany && matchesStatus;
    });
  }
);

// UI State Selectors
export const selectViewMode = createSelector(
  selectCustomerState,
  (state) => state.viewMode
);

export const selectIsLoading = createSelector(
  selectCustomerState,
  (state) => state.isLoading
);
```

### Effects Implementation

```typescript
@Injectable()
export class CustomerEffects {
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(() =>
        this.customerApi.getCustomers().pipe(
          map(customers => CustomerActions.loadCustomersSuccess({ customers })),
          catchError(error => of(CustomerActions.loadCustomersFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private customerApi: CustomerApiService
  ) {}
}
```

---

## Technical Implementation

### File Structure
```
src/app/customers/
├── components/
│   ├── customer-container.component.ts
│   ├── customer-filters.component.ts
│   ├── customer-card.component.ts
│   ├── customer-list.component.ts
│   └── customer-map.component.ts
├── models/
│   └── customer.model.ts
├── services/
│   ├── customer-api.service.ts
│   ├── geocoding.service.ts
│   └── customer-query-builder.service.ts
├── store/
│   ├── customer.actions.ts
│   ├── customer.reducer.ts
│   ├── customer.effects.ts
│   ├── customer.selectors.ts
│   └── customer.state.ts
└── pages/
    └── customers-page.component.ts
```

### Key Technologies
- **Angular 17+**: Latest framework features
- **NgRx**: State management with effects
- **Leaflet**: Interactive maps
- **TypeScript**: Type safety
- **SCSS**: Styling
- **Standalone Components**: Modern component architecture

### Performance Optimizations
- **OnPush Change Detection**: Reduced change detection cycles
- **Memoized Selectors**: Efficient state computation
- **Lazy Loading**: Route-based code splitting
- **Virtual Scrolling**: Large dataset handling
- **Debounced Search**: Optimized user input handling

---

## Features Overview

### ✅ Implemented Features
- **Interactive Map View**: Real Leaflet map with customer markers
- **Multiple View Modes**: Card, List, and Map views
- **Advanced Filtering**: Search, state, company, status filters
- **Responsive Design**: Mobile-friendly layout
- **State Management**: NgRx for predictable state updates
- **Geographic Visualization**: Customer locations on map
- **Modern UI**: Clean, professional design

### 🚀 Future Enhancements
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Customer insights dashboard
- **Export Functionality**: PDF/Excel export
- **Bulk Operations**: Multi-select actions
- **Advanced Search**: Full-text search
- **Customer Details**: Detailed customer profiles

---

## Deployment

### Development
```bash
npm start          # Run development server
npm run build      # Build for production
npm test           # Run unit tests
```

### Production
- **Platform**: Netlify
- **Build Command**: `npm run build:prod`
- **Publish Directory**: `dist/customer-manager/browser`
- **Environment**: Static hosting with API fallback

This architecture provides a scalable, maintainable, and performance-optimized solution for customer management with modern Angular best practices.
