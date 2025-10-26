import { GoogleGenAI } from "@google/genai";
import { FareBreakdown, TruckCategory, TruckCategoryDetails } from '../types';
import { PLATFORM_COMMISSION_RATE, TRUCK_CATEGORIES } from '../constants';

// Fix: As per guidelines, assume API_KEY is always available and initialize client directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface EstimateParams {
  category: TruckCategoryDetails;
  km: number;
  wait_h: number;
  night: boolean;
  reefer?: boolean;
  tolls?: number;
}

export const calculateFare = ({
  category,
  km,
  wait_h,
  night,
  reefer = false,
  tolls = 0,
}: EstimateParams): FareBreakdown => {
  const multipliers = category.pricing_multipliers;
  const base = multipliers.base;
  const per_km = multipliers.per_km * km;
  const wait = multipliers.wait_rate * wait_h;
  
  const night_fee = night ? (base + per_km) * 0.15 : 0; // 15% night surcharge
  const reefer_fee = reefer && multipliers.reefer_multiplier ? (base + per_km) * (multipliers.reefer_multiplier - 1) : 0;
  
  const fareBeforeFees = base + per_km + wait + night_fee + reefer_fee + tolls;
  const platform_fee = fareBeforeFees * PLATFORM_COMMISSION_RATE;
  const total_fare = fareBeforeFees + platform_fee;
  const driver_payout = total_fare - platform_fee;

  return {
    base_fee: Math.round(base),
    distance_charge: Math.round(per_km),
    waiting_charge: Math.round(wait),
    night_surcharge: Math.round(night_fee),
    reefer_surcharge: Math.round(reefer_fee),
    tolls: Math.round(tolls),
    platform_fee: Math.round(platform_fee),
    total_fare: Math.round(total_fare),
    driver_payout: Math.round(driver_payout),
  };
};


export const getTruckSuggestion = async (goodsDescription: string): Promise<TruckCategory> => {
  try {
    const categoryList = TRUCK_CATEGORIES.map(c => c.id).join(', ');
    const prompt = `Given the following goods description, suggest the most suitable truck category from this list: ${categoryList}. The goods are: "${goodsDescription}". Respond with ONLY the category name from the list provided, in lowercase. For example: 'flatbed'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Per guidelines, response.text is the correct way to get the text output.
    const suggestedCategory = response.text.trim() as TruckCategory;

    // Validate the response from the model
    if (Object.values(TruckCategory).includes(suggestedCategory)) {
      return suggestedCategory;
    } else {
      console.warn(`Gemini returned an invalid category: ${suggestedCategory}, falling back to general_cargo.`);
      return TruckCategory.GENERAL_CARGO;
    }
  } catch (error) {
    console.error("Error getting truck suggestion from Gemini:", error);
    // Fallback to a default category if the API call fails.
    return TruckCategory.GENERAL_CARGO;
  }
};
