import React, { useState, useEffect } from 'react';
import { Load, Quote } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Map from './Map'; // Import the new Map component

interface ConfirmationProps {
  loadDetails: Partial<Load>;
  quote: Quote | null;
  onBookAnother: () => void;
  onJobComplete: () => void;
}

const SIMULATION_DURATION_MS = 15000; // 15 seconds for the simulation

const Confirmation: React.FC<ConfirmationProps> = ({ loadDetails, quote, onBookAnother, onJobComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'in_transit' | 'delivered'>('in_transit');

  useEffect(() => {
    if (status === 'in_transit') {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.min(100, (elapsedTime / SIMULATION_DURATION_MS) * 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus('delivered');
          onJobComplete();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [status, onJobComplete]);

  return (
    <div className="max-w-4xl mx-auto mt-16 animate-fade-in">
      <Card title={status === 'in_transit' ? "Your Shipment is On Its Way!" : "Shipment Delivered!"}>
        <div className="space-y-6">
          <Map
            pickupAddr={loadDetails.pickup_addr}
            dropAddr={loadDetails.drop_addr}
            pickupLatLng={loadDetails.pickup_latlng}
            dropLatLng={loadDetails.drop_latlng}
            simulationDuration={SIMULATION_DURATION_MS}
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-slate-700">Live Progress</h4>
              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {status === 'delivered' ? 'Delivered' : 'In Transit'}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-left border-t border-slate-200 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Shipment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600">
                <p><strong>From:</strong><br/>{loadDetails.pickup_addr}</p>
                <p><strong>To:</strong><br/>{loadDetails.drop_addr}</p>
                <div>
                    <p><strong>Goods:</strong> {loadDetails.goods_type}</p>
                    <p><strong>Weight:</strong> {loadDetails.weight_tons} tons</p>
                </div>
            </div>
          </div>

          <div className="mt-6 text-center border-t border-slate-200 pt-6">
            <Button onClick={onBookAnother} size="lg" variant="secondary">
              Book Another Load
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Confirmation;