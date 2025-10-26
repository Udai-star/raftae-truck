import React, { useState, useCallback } from 'react';
import { Load, TruckCategory } from '../types';
import { TRUCK_CATEGORIES } from '../constants';
import { getTruckSuggestion } from '../services/pricingService';
import Card from './common/Card';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';
import LocationPinIcon from './icons/LocationPinIcon';
import WeightIcon from './icons/WeightIcon';
import CalendarIcon from './icons/CalendarIcon';
import TruckIcon from './icons/TruckIcon';
import SparklesIcon from './icons/SparklesIcon';

interface LoadDetailsFormProps {
  initialData: Partial<Load>;
  onSubmit: (data: Partial<Load>) => void;
  isLoading: boolean;
}

const LoadDetailsForm: React.FC<LoadDetailsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(initialData);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'weight_tons' ? parseFloat(value) : value }));
  };

  const handleSuggestTruck = useCallback(async () => {
    if (!formData.goods_type) return;
    setIsSuggesting(true);
    // Fix: Updated to handle the non-nullable return type of getTruckSuggestion.
    const suggestion = await getTruckSuggestion(formData.goods_type);
    setFormData(prev => ({ ...prev, category_required: suggestion }));
    setIsSuggesting(false);
  }, [formData.goods_type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-16">
      <Card title="Shipment Route">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="pickup_addr"
            name="pickup_addr"
            label="Pickup Location"
            value={formData.pickup_addr || ''}
            onChange={handleChange}
            icon={<LocationPinIcon />}
            required
          />
          <Input
            id="drop_addr"
            name="drop_addr"
            label="Dropoff Location"
            value={formData.drop_addr || ''}
            onChange={handleChange}
            icon={<LocationPinIcon />}
            required
          />
        </div>
      </Card>

      <Card title="Goods & Vehicle Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="goods_type"
              name="goods_type"
              label="Goods Description"
              value={formData.goods_type || ''}
              onChange={handleChange}
              placeholder="e.g., Cotton bales, electronics"
              required
            />
            <Input
              id="weight_tons"
              name="weight_tons"
              label="Weight (Tons)"
              type="number"
              value={formData.weight_tons || ''}
              onChange={handleChange}
              icon={<WeightIcon />}
              required
            />
        </div>
        <div className="mt-4">
          <Select
            id="category_required"
            name="category_required"
            label="Truck Category"
            value={formData.category_required || ''}
            onChange={handleChange}
            icon={<TruckIcon />}
            required
          >
            <option value="" disabled>Select a truck type</option>
            {TRUCK_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
          <div className="mt-2 text-right">
            <Button
              type="button"
              onClick={handleSuggestTruck}
              variant="secondary"
              size="sm"
              disabled={isSuggesting || !formData.goods_type}
            >
              <SparklesIcon />
              {isSuggesting ? 'Thinking...' : 'AI Suggest Category'}
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Calculating...' : 'Get Fare Estimate'}
        </Button>
      </div>
    </form>
  );
};

export default LoadDetailsForm;
