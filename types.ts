

export type UserRole = 'shipper' | 'driver' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  phone: string;
  role: UserRole | null;
  status: UserStatus;
  registeredAt: string;
}

export enum TruckCategory {
  GENERAL_CARGO = 'general_cargo',
  FLATBED = 'flatbed',
  REEFER = 'reefer',
  ARTICULATED_TRAILER = 'articulated_trailer',
  TANKER = 'tanker',
  DUMP_TRUCK = 'dump_truck',
}

export interface TruckCategoryDetails {
  id: TruckCategory;
  name: string;
  description: string;
  min_payload_tons: number;
  max_payload_tons: number;
  special_flags: string[];
  pricing_multipliers: {
    base: number;
    per_km: number;
    wait_rate: number;
    reefer_multiplier?: number;
  };
}

export interface FareBreakdown {
  base_fee: number;
  distance_charge: number;
  waiting_charge: number;
  night_surcharge: number;
  reefer_surcharge: number;
  tolls: number;
  platform_fee: number;
  total_fare: number;
  driver_payout: number;
}

export interface Load {
  id: string;
  shipper_id: string;
  pickup_addr: string;
  drop_addr: string;
  pickup_latlng?: [number, number];
  drop_latlng?: [number, number];
  goods_type: string;
  weight_tons: number;
  category_required: TruckCategory;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  payout?: number;
  completedAt?: string;
}

export interface Quote {
  id: string;
  load_details: Partial<Load>;
  price_breakdown_json: FareBreakdown;
  expires_at: Date;
}