# Customer Manager

A production-ready Angular 19 SPA for managing customer data with advanced filtering, NgRx state management, and modern architecture using standalone components.

## Features

- 🚀 **Angular 19** with standalone components
- 📦 **NgRx Store** with modular architecture using `createFeature`
- 🎯 **Advanced filtering** with query builder
- 📊 **1000+ mock customer records** for testing
- 🗺️ **Interactive map view** of customers
- 📱 **Responsive design** with modern UI
- 🔄 **Lazy loading** with standalone routes
- 🛠️ **Class-transformer** for data transformation
- 🎨 **SCSS** with component-specific styling

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm

### Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Generate mock data (optional - already included):
```bash
node generate-mock-data.js
```

3. Start development servers:
```bash
npm run start:full
```

This will start both the Angular dev server (port 4200) and the JSON server (port 3000) concurrently.

Alternatively, you can start them separately:
```bash
# Start JSON server for mock API
npm run json-server

# Start Angular dev server
npm start
```

4. Open your browser and navigate to `http://localhost:4200/`

## Architecture

### Project Structure
```
src/app/
├── customers/
│   ├── components/          # Standalone UI components
│   │   ├── customer-card.component.ts
│   │   ├── customer-filters.component.ts
│   │   ├── customer-list.component.ts
│   │   ├── customer-map.component.ts
│   │   └── customer-container.component.ts
│   ├── pages/              # Page components
│   │   └── customers-page.component.ts
│   ├── store/              # NgRx state management
│   │   ├── customer.actions.ts
│   │   ├── customer.effects.ts
│   │   ├── customer.reducer.ts
│   │   ├── customer.selectors.ts
│   │   ├── customer.state.ts
│   │   └── customer.feature.ts
│   ├── services/           # Data services
│   │   ├── customer-api.service.ts
│   │   └── customer-query-builder.service.ts
│   └── models/             # Data models
│       └── customer.model.ts
├── shared/                 # Shared components
└── assets/data/           # Mock data
    └── customers.json
```

### Key Architectural Decisions

- **Standalone Components**: All components use Angular's standalone API
- **Modular NgRx**: Uses `createFeature` for scoped state management
- **Container/Presentational Pattern**: Clear separation of concerns
- **Lazy Loading**: Route-based code splitting with `loadComponent`
- **Data Transformation**: Uses `class-transformer` for type-safe data handling
- **Query Builder**: Flexible filtering with URL-based state persistence

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Available Scripts

- `npm start` - Start Angular development server
- `npm run build` - Build the project for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests
- `npm run json-server` - Start JSON server on port 3000
- `npm run start:full` - Start both Angular and JSON server concurrently

## API Endpoints

The JSON server provides a REST API at `http://localhost:3000`:

- `GET /customers` - Get all customers
- `GET /customers?name_like=John` - Search customers by name
- `GET /customers?company_like=Tech` - Search customers by company
- `GET /customers?_page=1&_limit=20` - Paginated results

## Mock Data

The application includes 1000+ mock customer records with realistic data:
- Names, emails, phone numbers
- Addresses with coordinates for map display
- Company information
- Account status and join dates

## Technology Stack

### Core
- **Angular 19** - Latest Angular framework
- **TypeScript 5.7** - Type-safe development
- **RxJS 7.8** - Reactive programming

### State Management
- **NgRx Store** - Predictable state container
- **NgRx Effects** - Side effect management
- **NgRx Store DevTools** - Development tools

### Data Layer
- **class-transformer** - Object transformation
- **class-validator** - Data validation
- **reflect-metadata** - Metadata reflection

### Development Tools
- **JSON Server** - Mock REST API
- **Faker.js** - Mock data generation
- **Concurrently** - Run multiple npm scripts

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
