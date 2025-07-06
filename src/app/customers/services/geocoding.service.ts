import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  
  // Simple mock coordinates for US states (approximate centers)
  private stateCoordinates: { [key: string]: Coordinates } = {
    'Alabama': { latitude: 32.3182, longitude: -86.9023 },
    'Alaska': { latitude: 61.2181, longitude: -149.9003 },
    'Arizona': { latitude: 33.7298, longitude: -111.4312 },
    'Arkansas': { latitude: 34.9697, longitude: -92.3731 },
    'California': { latitude: 36.1162, longitude: -119.6816 },
    'Colorado': { latitude: 39.0598, longitude: -105.3111 },
    'Connecticut': { latitude: 41.5978, longitude: -72.7555 },
    'Delaware': { latitude: 39.3185, longitude: -75.5071 },
    'Florida': { latitude: 27.7663, longitude: -81.6868 },
    'Georgia': { latitude: 33.0406, longitude: -83.6431 },
    'Hawaii': { latitude: 21.0943, longitude: -157.4983 },
    'Idaho': { latitude: 44.2405, longitude: -114.4788 },
    'Illinois': { latitude: 40.3495, longitude: -88.9861 },
    'Indiana': { latitude: 39.8494, longitude: -86.2583 },
    'Iowa': { latitude: 42.0115, longitude: -93.2105 },
    'Kansas': { latitude: 38.5266, longitude: -96.7265 },
    'Kentucky': { latitude: 37.6681, longitude: -84.6701 },
    'Louisiana': { latitude: 31.1695, longitude: -91.8678 },
    'Maine': { latitude: 44.6939, longitude: -69.3819 },
    'Maryland': { latitude: 39.0639, longitude: -76.8021 },
    'Massachusetts': { latitude: 42.2081, longitude: -71.0275 },
    'Michigan': { latitude: 43.3266, longitude: -84.5361 },
    'Minnesota': { latitude: 45.7326, longitude: -93.9196 },
    'Mississippi': { latitude: 32.7673, longitude: -89.6812 },
    'Missouri': { latitude: 38.4561, longitude: -92.2884 },
    'Montana': { latitude: 47.0527, longitude: -110.2140 },
    'Nebraska': { latitude: 41.1254, longitude: -98.2681 },
    'Nevada': { latitude: 38.3135, longitude: -117.0554 },
    'New Hampshire': { latitude: 43.4525, longitude: -71.5639 },
    'New Jersey': { latitude: 40.3140, longitude: -74.5089 },
    'New Mexico': { latitude: 34.8405, longitude: -106.2485 },
    'New York': { latitude: 42.1657, longitude: -74.9481 },
    'North Carolina': { latitude: 35.6301, longitude: -79.8064 },
    'North Dakota': { latitude: 47.5289, longitude: -99.7840 },
    'Ohio': { latitude: 40.3888, longitude: -82.7649 },
    'Oklahoma': { latitude: 35.5653, longitude: -96.9289 },
    'Oregon': { latitude: 44.9318, longitude: -120.5542 },
    'Pennsylvania': { latitude: 40.5908, longitude: -77.2098 },
    'Rhode Island': { latitude: 41.6809, longitude: -71.5118 },
    'South Carolina': { latitude: 33.8191, longitude: -80.9066 },
    'South Dakota': { latitude: 44.2998, longitude: -99.4388 },
    'Tennessee': { latitude: 35.7478, longitude: -86.7123 },
    'Texas': { latitude: 31.0545, longitude: -97.5635 },
    'Utah': { latitude: 40.1135, longitude: -111.8535 },
    'Vermont': { latitude: 44.0459, longitude: -72.7107 },
    'Virginia': { latitude: 37.7693, longitude: -78.1700 },
    'Washington': { latitude: 47.4009, longitude: -121.4905 },
    'West Virginia': { latitude: 38.4912, longitude: -80.9545 },
    'Wisconsin': { latitude: 44.2619, longitude: -89.6165 },
    'Wyoming': { latitude: 42.7559, longitude: -107.3025 }
  };

  /**
   * Get coordinates for a customer based on their state
   * In a real application, you would use a geocoding API like Google Maps or Nominatim
   */
  getCoordinatesForCustomer(customer: Customer): Coordinates | null {
    const stateCoords = this.stateCoordinates[customer.state];
    if (!stateCoords) {
      console.warn(`No coordinates found for state: ${customer.state}`);
      return null;
    }

    // Add some random variation within the state to spread out markers
    const latVariation = (Math.random() - 0.5) * 2; // ±1 degree
    const lngVariation = (Math.random() - 0.5) * 2; // ±1 degree

    return {
      latitude: stateCoords.latitude + latVariation,
      longitude: stateCoords.longitude + lngVariation
    };
  }

  /**
   * Get coordinates for all customers
   */
  enrichCustomersWithCoordinates(customers: Customer[]): Customer[] {
    return customers.map(customer => {
      if (customer.latitude && customer.longitude) {
        // Already has coordinates
        return customer;
      }

      const coords = this.getCoordinatesForCustomer(customer);
      if (coords) {
        // Create a new customer object with coordinates
        const enrichedCustomer = Object.assign(Object.create(Object.getPrototypeOf(customer)), customer);
        enrichedCustomer.latitude = coords.latitude;
        enrichedCustomer.longitude = coords.longitude;
        return enrichedCustomer;
      }

      return customer;
    });
  }
}
