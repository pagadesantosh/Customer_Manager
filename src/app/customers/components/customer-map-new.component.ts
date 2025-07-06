import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../models';
import { GeocodingService } from '../services/geocoding.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-customer-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div class="map-header">
        <h3>Customer Locations</h3>
        <div class="map-controls">
          <div class="customer-count">
            {{ filteredCustomers.length }} customers
          </div>
          <button 
            class="reset-view-btn"
            (click)="resetView()"
            title="Reset map view">
            🌍 Reset View
          </button>
        </div>
      </div>
      
      <div class="map-wrapper">
        <div #mapContainer class="leaflet-map"></div>
        
        <!-- Customer info popup overlay -->
        <div class="customer-info" *ngIf="selectedCustomer" [style.display]="selectedCustomer ? 'block' : 'none'">
          <div class="customer-card">
            <button class="close-btn" (click)="closeCustomerInfo()">×</button>
            <div class="customer-avatar">
              <img [src]="selectedCustomer.avatarUrl" 
                   [alt]="selectedCustomer.fullName"
                   (error)="onImageError($event, selectedCustomer)">
            </div>
            <div class="customer-details">
              <h4>{{ selectedCustomer.fullName }}</h4>
              <p class="company">{{ selectedCustomer.company }}</p>
              <p class="job-title">{{ selectedCustomer.jobTitle }}</p>
              <div class="customer-stats">
                <div class="stat">
                  <span class="label">Revenue:</span>
                  <span class="value">{{ selectedCustomer.revenueFormatted }}</span>
                </div>
                <div class="stat">
                  <span class="label">Status:</span>
                  <span class="value" [class]="'status-' + selectedCustomer.status">
                    {{ selectedCustomer.status | titlecase }}
                  </span>
                </div>
                <div class="stat">
                  <span class="label">Location:</span>
                  <span class="value">{{ selectedCustomer.city }}, {{ selectedCustomer.state }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .map-header {
      background: #f8f9fa;
      padding: 16px 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    
    .map-header h3 {
      margin: 0;
      color: #2c3e50;
    }
    
    .map-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .customer-count {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .reset-view-btn {
      background: #1976d2;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }
    
    .reset-view-btn:hover {
      background: #1565c0;
    }
    
    .map-wrapper {
      flex: 1;
      position: relative;
      min-height: 500px;
    }
    
    .leaflet-map {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }
    
    .customer-info {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1000;
      pointer-events: auto;
    }
    
    .customer-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 20px;
      width: 300px;
      position: relative;
      border: 1px solid #e0e0e0;
    }
    
    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-btn:hover {
      color: #666;
    }
    
    .customer-avatar {
      text-align: center;
      margin-bottom: 16px;
    }
    
    .customer-avatar img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #e0e0e0;
    }
    
    .customer-details h4 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 1.25rem;
      text-align: center;
    }
    
    .company {
      color: #666;
      font-weight: 500;
      margin: 0 0 4px 0;
      text-align: center;
    }
    
    .job-title {
      color: #888;
      font-size: 0.875rem;
      margin: 0 0 16px 0;
      text-align: center;
    }
    
    .customer-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .stat .label {
      color: #666;
      font-size: 0.875rem;
    }
    
    .stat .value {
      font-weight: 500;
      color: #2c3e50;
    }
    
    .status-active {
      color: #4caf50;
    }
    
    .status-inactive {
      color: #f44336;
    }
    
    .status-pending {
      color: #ff9800;
    }

    /* Popup styles */
    :host ::ng-deep .marker-popup {
      font-family: inherit;
    }
    
    :host ::ng-deep .popup-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    :host ::ng-deep .popup-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    :host ::ng-deep .popup-header h4 {
      margin: 0;
      font-size: 1rem;
    }
    
    :host ::ng-deep .popup-header p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }
    
    :host ::ng-deep .popup-details p {
      margin: 4px 0;
      font-size: 0.875rem;
    }
    
    :host ::ng-deep .status-active {
      color: #4caf50;
      font-weight: 500;
    }
    
    :host ::ng-deep .status-inactive {
      color: #f44336;
      font-weight: 500;
    }
    
    :host ::ng-deep .status-pending {
      color: #ff9800;
      font-weight: 500;
    }
  `]
})
export class CustomerMapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() customers: Customer[] = [];
  @Input() selectedCustomerId: number | null = null;
  @Output() customerSelect = new EventEmitter<Customer>();

  private map!: L.Map;
  private markers: L.Marker[] = [];
  filteredCustomers: Customer[] = [];
  selectedCustomer: Customer | null = null;

  constructor(private geocodingService: GeocodingService) {}

  ngOnInit() {
    this.updateFilteredCustomers();
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  ngOnChanges() {
    this.updateFilteredCustomers();
    if (this.map) {
      this.addCustomerMarkers();
    }
  }

  private updateFilteredCustomers() {
    // Enrich customers with coordinates
    this.filteredCustomers = this.geocodingService.enrichCustomersWithCoordinates(this.customers);
  }

  private initializeMap() {
    // Initialize the map
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [39.8283, -98.5795], // Center of USA
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add customer markers
    this.addCustomerMarkers();
  }

  private addCustomerMarkers() {
    // Clear existing markers
    this.clearMarkers();

    // Add markers for customers with coordinates
    this.filteredCustomers.forEach(customer => {
      if (customer.latitude && customer.longitude) {
        this.addCustomerMarker(customer);
      }
    });

    // Fit map to show all markers if there are any
    if (this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private addCustomerMarker(customer: Customer) {
    if (!customer.latitude || !customer.longitude) return;

    // Create custom marker with status-based color
    const markerColor = this.getMarkerColor(customer.status);
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${markerColor};
        border: 3px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([customer.latitude, customer.longitude], {
      icon: customIcon,
      title: customer.fullName
    });

    // Create popup content
    const popupContent = `
      <div class="marker-popup">
        <div class="popup-header">
          <img src="${customer.avatarUrl}" alt="${customer.fullName}" class="popup-avatar" 
               onerror="this.src='https://via.placeholder.com/40x40/cccccc/666666?text=${customer.firstName.charAt(0)}'" />
          <div>
            <h4>${customer.fullName}</h4>
            <p>${customer.company}</p>
          </div>
        </div>
        <div class="popup-details">
          <p><strong>Revenue:</strong> ${customer.revenueFormatted}</p>
          <p><strong>Status:</strong> <span class="status-${customer.status}">${customer.status}</span></p>
          <p><strong>Location:</strong> ${customer.city}, ${customer.state}</p>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    // Add click event
    marker.on('click', () => {
      this.onCustomerSelect(customer);
    });

    // Add to map and track
    marker.addTo(this.map);
    this.markers.push(marker);
  }

  private getMarkerColor(status: string): string {
    switch (status) {
      case 'active': return '#4caf50';
      case 'inactive': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#1976d2';
    }
  }

  private clearMarkers() {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  onCustomerSelect(customer: Customer) {
    this.selectedCustomer = customer;
    this.customerSelect.emit(customer);

    // Center map on selected customer
    if (customer.latitude && customer.longitude) {
      this.map.setView([customer.latitude, customer.longitude], 8);
    }
  }

  closeCustomerInfo() {
    this.selectedCustomer = null;
  }

  resetView() {
    if (this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    } else {
      this.map.setView([39.8283, -98.5795], 4);
    }
  }

  onImageError(event: any, customer: Customer) {
    // Fallback to a default avatar if image fails to load
    event.target.src = 'https://via.placeholder.com/60x60/cccccc/666666?text=' + customer.firstName.charAt(0);
  }
}
