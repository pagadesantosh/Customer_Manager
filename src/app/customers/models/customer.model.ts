import { Transform } from 'class-transformer';

export interface CustomerFilters {
  states: string[];
  companies: string[];
  statuses: string[];
  searchTerm: string;
}

export type ViewMode = 'card' | 'list' | 'map';

export class Customer {
  id!: number;

  @Transform(({ value }) => value)
  firstName!: string;

  @Transform(({ value }) => value)
  lastName!: string;

  email!: string;
  phone!: string;
  company!: string;

  @Transform(({ value }) => value)
  jobTitle!: string;

  state!: string;
  city!: string;
  address!: string;

  @Transform(({ value }) => value)
  zipCode!: string;

  @Transform(({ value }) => value)
  avatarUrl!: string;

  @Transform(({ value }) => new Date(value))
  registrationDate!: Date;

  @Transform(({ value }) => new Date(value))
  lastLogin!: Date;

  status!: 'active' | 'inactive' | 'pending';
  revenue!: number;
  notes!: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isActive(): boolean {
    return this.status === 'active';
  }

  get revenueFormatted(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.revenue);
  }
}

// Raw API response interface (snake_case)
export interface CustomerApiResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  state: string;
  city: string;
  address: string;
  zip_code: string;
  avatar_url: string;
  registration_date: string;
  last_login: string;
  status: string;
  revenue: number;
  notes: string;
}
