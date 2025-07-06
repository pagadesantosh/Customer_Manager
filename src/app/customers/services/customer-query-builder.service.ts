import { Injectable } from '@angular/core';
import { CustomerFilters } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerQueryBuilderService {

  buildQueryParams(filters: CustomerFilters): Record<string, any> {
    const params: Record<string, any> = {};

    if (filters.states.length > 0) {
      params['states'] = filters.states.join(',');
    }

    if (filters.companies.length > 0) {
      params['companies'] = filters.companies.join(',');
    }

    if (filters.statuses.length > 0) {
      params['statuses'] = filters.statuses.join(',');
    }

    if (filters.searchTerm.trim()) {
      params['search'] = filters.searchTerm.trim();
    }

    return params;
  }

  parseQueryParams(params: Record<string, any>): CustomerFilters {
    return {
      states: params['states'] ? params['states'].split(',') : [],
      companies: params['companies'] ? params['companies'].split(',') : [],
      statuses: params['statuses'] ? params['statuses'].split(',') : [],
      searchTerm: params['search'] || ''
    };
  }

  buildSortParams(sortField?: string, sortDirection?: 'asc' | 'desc'): Record<string, string> {
    const params: Record<string, string> = {};
    
    if (sortField) {
      params['_sort'] = sortField;
    }
    
    if (sortDirection) {
      params['_order'] = sortDirection;
    }
    
    return params;
  }

  buildPaginationParams(page: number, limit: number): Record<string, string> {
    return {
      '_page': page.toString(),
      '_limit': limit.toString()
    };
  }
}
