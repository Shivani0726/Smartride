export type VehicleCategory = 'Cars' | 'Bikes' | 'Scooters';

export type CategoryFilter = 'All Vehicles' | 'Cars' | 'Bikes' | 'Scooters';

export type VehicleType = 
  | 'City Hatchback' 
  | 'Micro SUV' 
  | 'Compact SUV' 
  | 'Mid-size SUV' 
  | 'Luxury Crossover'
  | 'Electric Commuter Bike'
  | 'Electric Performance Bike'
  | 'Electric Street Bike'
  | 'Electric Smart Scooter'
  | 'Electric Performance Scooter'
  | 'Electric Family Scooter';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory; // 'Cars' | 'Bikes' | 'Scooters'
  vehicleType: VehicleType;
  price: number; // in Indian Rupees
  priceDisplay: string;
  batteryCapacity: number; // in kWh
  batteryCapacityDisplay: string;
  drivingRange: number; // in km
  drivingRangeDisplay: string;
  chargingTime: string; // e.g. "56 mins (10-80% DC)" or "4.5 hrs"
  fastChargingMinutes: number; // in mins
  topSpeed: number; // in km/h
  topSpeedDisplay: string;
  acceleration0to100: string;
  rating: number; // out of 5
  reviewCount: number;
  keyFeatures: string[];
  description: string;
  vehicleImage: string;
  tag: 'Featured' | 'Popular' | 'New Arrival';
  seatingCapacity: number;
  bootSpace: string;
  warranty: string;
  motorPower: string;
}

export type SortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'range-desc' 
  | 'rating-desc';

export interface FilterState {
  search: string;
  category: CategoryFilter;
  brands: string[];
  vehicleTypes: VehicleType[];
  maxPrice: number;
  minRange: number;
  minBattery: number;
  maxChargingMinutes: number;
}

export interface AdvisorCriteria {
  budget: number; // max budget in INR
  dailyDistance: number; // in km
  requiredRange: number; // in km
  preferredCategory: 'any' | VehicleCategory;
  preferredType: string; // 'any' or specific VehicleType
  chargingPreference: 'home' | 'public_fast' | 'any';
}

export interface AdvisorRecommendation {
  vehicle: Vehicle;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  verdict: string;
}
