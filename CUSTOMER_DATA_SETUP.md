# Customer Data Configuration

## Overview
This application now uses environment-specific customer data files to optimize performance between development and production environments.

## Files Created/Modified

### 1. Customer Data Files
- **`src/assets/data/customers.json`** - Full dataset (1000 customers) for development
- **`src/assets/data/customers-prod.json`** - Limited dataset (100 customers) for production

### 2. Environment Configuration
- **`src/environments/environment.ts`** - Development environment
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/customers',
    useStaticData: true,
    customerDataFile: '/assets/data/customers.json' // Full dataset for development
  };
  ```

- **`src/environments/environment.prod.ts`** - Production environment
  ```typescript
  export const environment = {
    production: true,
    apiUrl: '',
    useStaticData: true,
    customerDataFile: '/assets/data/customers-prod.json' // Limited dataset for production
  };
  ```

### 3. Service Updates
- **`src/app/customers/services/customer-api.service.ts`** - Updated to use `environment.customerDataFile`
- **`src/app/orders/services/order-api.service.ts`** - Updated to use `environment.customerDataFile`

## Benefits

### Development Environment
- Uses full dataset (1000 customers) for comprehensive testing
- Better representation of real-world data volume
- More thorough testing of filtering and search functionality

### Production Environment
- Uses limited dataset (100 customers) for faster loading
- Reduced bundle size and network transfer
- Better performance on mobile devices and slower connections
- Avoids the HTTP parsing error that was occurring with the large dataset

## Usage

### Local Development
```bash
npm start
# Uses customers.json (1000 customers)
```

### Production Build
```bash
npm run build
# Uses customers-prod.json (100 customers)
```

### Deployment
When deploying to Netlify or other platforms, the production build will automatically use the smaller dataset, preventing HTTP parsing errors and improving load times.

## File Sizes
- `customers.json`: ~1.2MB (1000 customers)
- `customers-prod.json`: ~120KB (100 customers)

## Error Resolution
This setup resolves the HTTP failure during parsing error that was occurring when trying to load the large customer dataset in production environments.

### Key Fix: Environment Configuration
The critical fix was adding `fileReplacements` to the production build configuration in `angular.json`:

```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ],
  // ... other production config
}
```

This ensures that when building for production, Angular uses the production environment file which points to the smaller `customers-prod.json` file instead of the large `customers.json` file.
