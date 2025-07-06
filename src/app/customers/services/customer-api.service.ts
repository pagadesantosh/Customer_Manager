import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Customer, CustomerApiResponse, CustomerFilters } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCustomers(filters?: CustomerFilters): Observable<Customer[]> {
    // Use static data in production
    if (environment.useStaticData) {
      return this.http.get<{customers: CustomerApiResponse[]}>('/assets/data/customers.json').pipe(
        map(response => this.transformCustomers(response.customers, filters))
      );
    }

    let params = new HttpParams();
    
    if (filters) {
      if (filters.searchTerm) {
        // JSON Server supports text search with q
        params = params.set('q', filters.searchTerm);
      }
      if (filters.companies.length > 0) {
        // Use the first company for filtering (JSON Server limitation)
        params = params.set('company_like', filters.companies[0]);
      }
      if (filters.states.length > 0) {
        // Use the first state for filtering
        params = params.set('state', filters.states[0]);
      }
      if (filters.statuses.length > 0) {
        // Use the first status for filtering
        params = params.set('status', filters.statuses[0]);
      }
    }

    return this.http.get<CustomerApiResponse[]>(this.baseUrl, { params }).pipe(
      map(response => this.transformCustomers(response, filters))
    );
  }

  private transformCustomers(response: CustomerApiResponse[], filters?: CustomerFilters): Customer[] {
    let customers = response.map(customerData => {
      const customer = new Customer();
      customer.id = customerData.id;
      customer.firstName = customerData.first_name;
      customer.lastName = customerData.last_name;
      customer.email = customerData.email;
      customer.phone = customerData.phone;
      customer.company = customerData.company;
      customer.jobTitle = customerData.job_title;
      customer.state = customerData.state;
      customer.city = customerData.city;
      customer.address = customerData.address;
      customer.zipCode = customerData.zip_code;
      customer.avatarUrl = customerData.avatar_url;
      customer.registrationDate = new Date(customerData.registration_date);
      customer.lastLogin = new Date(customerData.last_login);
      customer.status = customerData.status as 'active' | 'inactive' | 'pending';
      customer.revenue = customerData.revenue;
      customer.notes = customerData.notes;
      return customer;
    });

    // Apply client-side filtering when using static data
    if (environment.useStaticData && filters) {
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        customers = customers.filter(customer => 
          customer.firstName.toLowerCase().includes(term) ||
          customer.lastName.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term) ||
          customer.company.toLowerCase().includes(term)
        );
      }
      if (filters.states.length > 0) {
        customers = customers.filter(customer => filters.states.includes(customer.state));
      }
      if (filters.companies.length > 0) {
        customers = customers.filter(customer => filters.companies.includes(customer.company));
      }
      if (filters.statuses.length > 0) {
        customers = customers.filter(customer => filters.statuses.includes(customer.status));
      }
    }

    return customers;
  }

  getUniqueStates(): Observable<string[]> {
    if (environment.useStaticData) {
      return this.http.get<{customers: CustomerApiResponse[]}>('/assets/data/customers.json').pipe(
        map(response => {
          const states = [...new Set(response.customers.map(customer => customer.state))];
          return states.sort();
        })
      );
    }

    return this.http.get<CustomerApiResponse[]>(this.baseUrl).pipe(
      map(response => {
        const states = [...new Set(response.map(customer => customer.state))];
        return states.sort();
      })
    );
  }

  getUniqueCompanies(): Observable<string[]> {
    if (environment.useStaticData) {
      return this.http.get<{customers: CustomerApiResponse[]}>('/assets/data/customers.json').pipe(
        map(response => {
          const companies = [...new Set(response.customers.map(customer => customer.company))];
          return companies.sort();
        })
      );
    }
    return this.http.get<CustomerApiResponse[]>(this.baseUrl).pipe(
      map(response => {
        const companies = [...new Set(response.map(customer => customer.company))];
        return companies.sort();
      })
    );
  }
}
