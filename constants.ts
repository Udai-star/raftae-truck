
import { TruckCategory, TruckCategoryDetails } from './types';

export const TRUCK_CATEGORIES: TruckCategoryDetails[] = [
  {
    id: TruckCategory.GENERAL_CARGO,
    name: 'General Cargo / Box Truck',
    description: 'For palletized goods and general items.',
    min_payload_tons: 1,
    max_payload_tons: 25,
    special_flags: [],
    pricing_multipliers: { base: 5000, per_km: 100, wait_rate: 500 },
  },
  {
    id: TruckCategory.FLATBED,
    name: 'Flatbed',
    description: 'Ideal for steel, lumber, and machinery.',
    min_payload_tons: 5,
    max_payload_tons: 40,
    special_flags: [],
    pricing_multipliers: { base: 8000, per_km: 120, wait_rate: 600 },
  },
  {
    id: TruckCategory.REEFER,
    name: 'Reefer (Refrigerated)',
    description: 'For temperature-sensitive goods.',
    min_payload_tons: 3,
    max_payload_tons: 22,
    special_flags: ['temp_control', 'food_grade'],
    pricing_multipliers: { base: 12000, per_km: 150, wait_rate: 800, reefer_multiplier: 1.4 },
  },
  {
    // Fix: Corrected typo in enum member to match its definition in types.ts.
    id: TruckCategory.ARTICULATED_TRAILER,
    name: 'Articulated / Trailer (40ft/20ft)',
    description: 'For containers and heavy machinery.',
    min_payload_tons: 20,
    max_payload_tons: 60,
    special_flags: [],
    pricing_multipliers: { base: 15000, per_km: 180, wait_rate: 1000 },
  },
  {
    id: TruckCategory.TANKER,
    name: 'Tanker',
    description: 'For liquids (food-grade or chemical).',
    min_payload_tons: 10,
    max_payload_tons: 35,
    special_flags: ['hazmat', 'food_grade'],
    pricing_multipliers: { base: 10000, per_km: 140, wait_rate: 700 },
  },
  {
    id: TruckCategory.DUMP_TRUCK,
    name: 'Dump Truck',
    description: 'For sand, gravel, and construction debris.',
    min_payload_tons: 10,
    max_payload_tons: 30,
    special_flags: [],
    pricing_multipliers: { base: 7000, per_km: 130, wait_rate: 650 },
  },
];

export const PLATFORM_COMMISSION_RATE = 0.15; // 15%