import React, { useState, useCallback, useEffect } from 'react';
import { Load, Quote, TruckCategory } from '../../types';
import LoadDetailsForm from '../LoadDetailsForm';
import FareEstimate from '../FareEstimate';
import Confirmation from '../Confirmation';
import StepTracker from '../StepTracker';
import { calculateFare } from '../../services/pricingService';
import { TRUCK_CATEGORIES } from '../../constants';
import { notificationManager } from '../../services/notificationManager';

const STEPS = ['Load Details', 'Fare Estimate', 'Confirmation & Tracking'];

const ShipperDashboard: React.FC = () => {
  const [step, setStep] = useState(0); // 0: details, 1: estimate, 2: confirmation
  const [isFindingDriver, setIsFindingDriver] = useState(false);
  const [loadDetails, setLoadDetails] = useState<Partial<Load>>({
    pickup_addr: 'Saddar, Karachi',
    drop_addr: 'Gulberg, Lahore',
    goods_type: '200 boxes of consumer electronics',
    weight_tons: 5,
    category_required: TruckCategory.GENERAL_CARGO,
    // Coordinates for Karachi and Lahore for the map
    pickup_latlng: [24.8607, 67.0011],
    drop_latlng: [31.5204, 74.3587],
  });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetEstimate = useCallback(async (data: Partial<Load>) => {
    setIsLoading(true);
    // Add coordinates if not present (for manual entries)
    const finalData = {
        ...data,
        pickup_latlng: data.pickup_latlng || [24.8607, 67.0011],
        drop_latlng: data.drop_latlng || [31.5204, 74.3587]
    };
    setLoadDetails(finalData);
    
    await new Promise(res => setTimeout(res, 1500));
    
    const categoryDetails = TRUCK_CATEGORIES.find(c => c.id === finalData.category_required);
    if (!categoryDetails) {
        console.error("Selected truck category not found!");
        setIsLoading(false);
        return;
    }

    const mockTrip = { km: 1200, wait_h: 2, night: false, reefer: finalData.category_required === TruckCategory.REEFER, tolls: 3500 };
    const fareBreakdown = calculateFare({ category: categoryDetails, ...mockTrip });
    
    const newQuote: Quote = {
        id: `QT-${Date.now()}`,
        load_details: finalData,
        price_breakdown_json: fareBreakdown,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
    };

    setQuote(newQuote);
    setStep(1);
    setIsLoading(false);
  }, []);

  const handleConfirmBooking = () => {
    setIsLoading(true);
    setIsFindingDriver(true);

    setTimeout(() => {
        console.log("Booking Confirmed:", { loadDetails, quote });
        notificationManager.showNotification('Job Accepted!', {
            body: `A driver is en route to pick up your shipment from ${loadDetails.pickup_addr}.`
        });
        setIsFindingDriver(false);
        setStep(2);
        setIsLoading(false);
    }, 3000);
  };
  
  const handleJobComplete = () => {
      notificationManager.showNotification('Shipment Delivered!', {
          body: `Your shipment from ${loadDetails.pickup_addr} to ${loadDetails.drop_addr} has been successfully delivered.`
      });
  };

  const handleGoBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };
  
  const handleReset = () => {
    setStep(0);
    setQuote(null);
    setLoadDetails({
        pickup_addr: 'Saddar, Karachi',
        drop_addr: 'Gulberg, Lahore',
        goods_type: '',
        weight_tons: undefined,
        pickup_latlng: [24.8607, 67.0011],
        drop_latlng: [31.5204, 74.3587],
    });
  };

  if (isFindingDriver) {
    return (
        <div className="text-center py-20">
            <div className="animate-pulse">
                <div className="mx-auto h-12 w-12 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17H6V6h10v4l4 4H13v3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-700 mt-4">Finding a driver...</h2>
                <p className="text-slate-500">Please wait while we assign the nearest driver to your load.</p>
            </div>
        </div>
    );
  }

  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return <LoadDetailsForm initialData={loadDetails} onSubmit={handleGetEstimate} isLoading={isLoading} />;
      case 1:
        return <FareEstimate quote={quote} loadDetails={loadDetails} onConfirm={handleConfirmBooking} onGoBack={handleGoBack} isLoading={isLoading} />;
      case 2:
        return <Confirmation loadDetails={loadDetails} quote={quote} onBookAnother={handleReset} onJobComplete={handleJobComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <StepTracker currentStep={step} steps={STEPS} />
        {renderCurrentStep()}
    </div>
  );
};

export default ShipperDashboard;