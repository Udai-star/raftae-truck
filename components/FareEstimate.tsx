
import React from 'react';
import { Load, Quote } from '../types';
import { TRUCK_CATEGORIES } from '../constants';
import Card from './common/Card';
import Button from './common/Button';

interface FareEstimateProps {
  quote: Quote | null;
  loadDetails: Partial<Load>;
  onConfirm: () => void;
  onGoBack: () => void;
  isLoading: boolean;
}

const FareEstimate: React.FC<FareEstimateProps> = ({ quote, loadDetails, onConfirm, onGoBack, isLoading }) => {
  if (!quote) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-600">Could not calculate fare. Please go back and try again.</p>
        <Button onClick={onGoBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const { price_breakdown_json: breakdown } = quote;
  const truckName = TRUCK_CATEGORIES.find(c => c.id === loadDetails.category_required)?.name || 'N/A';
  
  const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="space-y-6 mt-16 animate-fade-in">
      <Card title="Your Instant Fare Estimate">
        <div className="text-center mb-6">
          <p className="text-slate-500 text-lg">Total Fare</p>
          <p className="text-5xl font-bold text-slate-900 tracking-tight">{formatCurrency(breakdown.total_fare)}</p>
          <p className="text-sm text-slate-500 mt-1">PKR (All-inclusive)</p>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h4 className="font-semibold text-lg mb-2 text-slate-700">Trip Details</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-600">
            <p><strong>From:</strong> {loadDetails.pickup_addr}</p>
            <p><strong>To:</strong> {loadDetails.drop_addr}</p>
            <p><strong>Goods:</strong> {loadDetails.goods_type}</p>
            <p><strong>Weight:</strong> {loadDetails.weight_tons} tons</p>
            <p className="col-span-2"><strong>Truck:</strong> {truckName}</p>
          </div>
        </div>
      </Card>

      <Card title="Price Breakdown">
        <ul className="space-y-2 text-slate-600">
          <li className="flex justify-between"><span>Base Fare</span> <span>{formatCurrency(breakdown.base_fee)}</span></li>
          <li className="flex justify-between"><span>Distance Charge</span> <span>{formatCurrency(breakdown.distance_charge)}</span></li>
          {breakdown.night_surcharge > 0 && <li className="flex justify-between"><span>Night Surcharge</span> <span>{formatCurrency(breakdown.night_surcharge)}</span></li>}
          {breakdown.reefer_surcharge > 0 && <li className="flex justify-between"><span>Reefer Surcharge</span> <span>{formatCurrency(breakdown.reefer_surcharge)}</span></li>}
          <li className="flex justify-between border-t border-slate-200 mt-2 pt-2">
            <span className="font-semibold text-slate-800">Subtotal</span> 
            <span className="font-semibold text-slate-800">{formatCurrency(breakdown.base_fee + breakdown.distance_charge + breakdown.night_surcharge + breakdown.reefer_surcharge)}</span>
          </li>
          <li className="flex justify-between text-sm"><span>Platform Fee</span> <span>{formatCurrency(breakdown.platform_fee)}</span></li>
        </ul>
        <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-slate-800">Total</span>
            <span className="text-xl font-bold text-slate-800">{formatCurrency(breakdown.total_fare)}</span>
        </div>
        <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg text-center">
            <p className="font-bold text-green-800">Driver Payout: {formatCurrency(breakdown.driver_payout)}</p>
        </div>
      </Card>

      <div className="pt-4 flex justify-between items-center">
        <Button onClick={onGoBack} variant="secondary" disabled={isLoading}>
          Go Back
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Booking...' : 'Confirm & Book Now'}
        </Button>
      </div>
    </div>
  );
};

export default FareEstimate;
