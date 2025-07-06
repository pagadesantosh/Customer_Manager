import { Component } from '@angular/core';
import { CustomerContainerComponent } from '../components/customer-container.component';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CustomerContainerComponent],
  template: `
    <div class="customers-page">
      <app-customer-container></app-customer-container>
    </div>
  `,
  styles: [`
    .customers-page {
      min-height: 100vh;
      background: #f8f9fa;
    }
  `]
})
export class CustomersPageComponent {}
