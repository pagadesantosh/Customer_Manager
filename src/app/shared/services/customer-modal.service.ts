import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Customer } from '../../customers/models';

@Injectable({
  providedIn: 'root'
})
export class CustomerModalService {
  private editCustomerSubject = new Subject<Customer>();
  
  editCustomer$ = this.editCustomerSubject.asObservable();

  openEditModal(customer: Customer): void {
    this.editCustomerSubject.next(customer);
  }
}
