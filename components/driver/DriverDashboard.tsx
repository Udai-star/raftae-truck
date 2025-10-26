import React, { useState, useMemo, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Load, TruckCategory } from '../../types';
import TruckIcon from '../icons/TruckIcon';
import LocationPinIcon from '../icons/LocationPinIcon';
import WeightIcon from '../icons/WeightIcon';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
import { notificationManager } from '../../services/notificationManager';


// Mock data for driver dashboard
const mockAvailableLoads: Omit<Load, 'shipper_id'>[] = [
  { id: 'LD10934', pickup_addr: 'Sialkot', drop_addr: 'Rawalpindi', category_required: TruckCategory.GENERAL_CARGO, goods_type: 'Surgical Instruments', weight_tons: 12, payout: 27200, status: 'pending' },
  { id: 'LD55812', pickup_addr: 'Gawadar Port', drop_addr: 'Quetta', category_required: TruckCategory.FLATBED, goods_type: 'Construction Steel', weight_tons: 35, payout: 93500, status: 'pending' },
  { id: 'LD78144', pickup_addr: 'Faisalabad Textile City', drop_addr: 'Karachi Port', category_required: TruckCategory.ARTICULATED_TRAILER, goods_type: 'Textile Rolls', weight_tons: 40, payout: 127500, status: 'pending' },
];

const mockCompletedJobs: Load[] = [
    { id: 'LD93742', shipper_id: 'shipper_2', pickup_addr: 'Faisalabad', drop_addr: 'Multan', category_required: TruckCategory.GENERAL_CARGO, goods_type: 'Fertilizer Bags', weight_tons: 20, payout: 42000, status: 'delivered', completedAt: '2023-10-24T14:00:00Z' },
    { id: 'LD38475', shipper_id: 'shipper_3', pickup_addr: 'Gwadar', drop_addr: 'Quetta', category_required: TruckCategory.FLATBED, goods_type: 'Building Materials', weight_tons: 30, payout: 105000, status: 'delivered', completedAt: '2023-10-22T18:30:00Z' },
];

// Mock data for performance score
const mockPerformance = {
    jobsOffered: 25,
    jobsAccepted: 22,
    deliveriesCompleted: 22, // Assumes all accepted jobs are completed for this mock
    onTimeDeliveries: 20,
};

// Helper component for the score visualization
const ScoreCircle = ({ score }: { score: number }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor = score >= 85 ? 'text-green-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="relative h-32 w-32 mx-auto">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#e5e7eb" // gray-200
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`transition-all duration-1000 ease-in-out ${scoreColor}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
        <span className={`text-sm font-bold mt-1 ${scoreColor}`}>/100</span>
      </div>
    </div>
  );
};


const DriverDashboard: React.FC = () => {
    const [isOnline, setIsOnline] = useState(false);
    const [acceptedJob, setAcceptedJob] = useState<Omit<Load, 'shipper_id'> | null>(null);
    const [availableLoads, setAvailableLoads] = useState<Omit<Load, 'shipper_id'>[]>([]);
    const [completedJobs, setCompletedJobs] = useState<Load[]>(mockCompletedJobs);

    // Simulate receiving new job offers in real-time when online
    useEffect(() => {
      const jobTimeouts: number[] = [];
  
      if (isOnline) {
        // Start with an empty list and simulate jobs arriving
        setAvailableLoads([]);
  
        // Stagger the arrival of mock jobs
        mockAvailableLoads.forEach((job, index) => {
          const timeoutId = window.setTimeout(() => {
            // Use functional update to avoid stale state in timeout
            setAvailableLoads((prevLoads) => [job, ...prevLoads]);
            notificationManager.showNotification('New Job Offer!', {
              body: `Load from ${job.pickup_addr} to ${job.drop_addr} is now available.`,
            });
          }, (index + 1) * 6000); // A new job appears every 6 seconds
          jobTimeouts.push(timeoutId);
        });
      } else {
        // Clear jobs when going offline
        setAvailableLoads([]);
      }
  
      // Cleanup: clear all scheduled timeouts when component unmounts or user goes offline
      return () => {
        jobTimeouts.forEach(clearTimeout);
      };
    }, [isOnline]);


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
    }

    const handleAcceptJob = (job: Omit<Load, 'shipper_id'>) => {
        setAcceptedJob(job);
        setAvailableLoads(prev => prev.filter(l => l.id !== job.id));
    };

    const handleCompleteJob = () => {
        if (!acceptedJob) return;
        
        const finishedJob: Load = {
            ...acceptedJob,
            shipper_id: `shipper_${Date.now()}`, // Mock shipper id
            status: 'delivered',
            completedAt: new Date().toISOString(),
        };

        setCompletedJobs(prev => [finishedJob, ...prev]);
        setAcceptedJob(null);
    };

    const NavigationLink = ({ address }: { address: string }) => (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-indigo-600 hover:underline cursor-pointer"
        >
          <span>{address}</span>
          <ExternalLinkIcon />
        </a>
    );

    const OnlineStatusToggle = () => (
         <div className="flex justify-center items-center mb-6">
            <span className={`mr-3 font-medium ${isOnline ? 'text-slate-400' : 'text-slate-800'}`}>Offline</span>
            <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isOnline ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
                <span
                    aria-hidden="true"
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isOnline ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
            <span className={`ml-3 font-medium ${isOnline ? 'text-green-600' : 'text-slate-400'}`}>Online</span>
        </div>
    );
    
    const totalEarnings = useMemo(() =>
        completedJobs.reduce((sum, job) => sum + (job.payout || 0), 0),
        [completedJobs]
    );

    const performanceMetrics = useMemo(() => {
        const acceptanceRate = mockPerformance.jobsOffered > 0 ? (mockPerformance.jobsAccepted / mockPerformance.jobsOffered) * 100 : 0;
        const onTimeRate = mockPerformance.deliveriesCompleted > 0 ? (mockPerformance.onTimeDeliveries / mockPerformance.deliveriesCompleted) * 100 : 0;
        
        // Weighted score: 60% on-time, 40% acceptance
        const score = (onTimeRate * 0.6) + (acceptanceRate * 0.4);

        return {
        score: Math.round(score),
        acceptanceRate: Math.round(acceptanceRate),
        onTimeRate: Math.round(onTimeRate),
        }
    }, []);

    if (acceptedJob) {
        return (
             <div className="space-y-6 animate-fade-in">
                <Card title={`On-Duty: Job #${acceptedJob.id}`}>
                     <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 text-slate-700">
                             <div className="flex items-start gap-3">
                                <LocationPinIcon />
                                <div>
                                    <p className="font-semibold">Pickup From</p>
                                    <NavigationLink address={acceptedJob.pickup_addr} />
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <LocationPinIcon />
                                <div>
                                    <p className="font-semibold">Deliver To</p>
                                    <NavigationLink address={acceptedJob.drop_addr} />
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <TruckIcon />
                                <div>
                                    <p className="font-semibold">Goods & Weight</p>
                                    <p>{acceptedJob.goods_type} - {acceptedJob.weight_tons} tons</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-slate-600">Estimated Payout</p>
                            <p className="text-4xl font-bold text-green-700">{formatCurrency(acceptedJob.payout || 0)}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Button onClick={handleCompleteJob} size="lg" className="bg-green-600 hover:bg-green-700 focus:ring-green-500">
                            Complete Job & Go Online
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Your Dashboard</h2>
            <OnlineStatusToggle />

            {isOnline ? (
                <Card title="Available Loads Near You">
                    {availableLoads.length > 0 ? (
                        <div className="space-y-4">
                            {availableLoads.map(load => (
                                <div key={load.id} className="p-4 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                                    <div className="flex-grow">
                                        <p className="font-bold text-slate-800">{load.pickup_addr} → {load.drop_addr}</p>
                                        <p className="text-sm text-slate-500 capitalize">{load.category_required.replace(/_/g, ' ')} - {load.weight_tons} tons</p>
                                        <p className="text-sm text-slate-500">Goods: {load.goods_type}</p>
                                    </div>
                                    <div className="text-left md:text-right w-full md:w-auto mt-2 md:mt-0">
                                        <p className="font-semibold text-lg text-green-700">{formatCurrency(load.payout || 0)}</p>
                                        <Button onClick={() => handleAcceptJob(load)} size="sm" variant="primary" className="mt-1 w-full md:w-auto">Accept Job</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-8">
                            <div className="animate-pulse mx-auto h-8 w-8 text-slate-400"><TruckIcon /></div>
                            <p className="mt-2 text-slate-600">Searching for jobs near you...</p>
                        </div>
                    )}
                </Card>
            ) : (
                <Card title="You are Offline">
                    <div className="text-center py-10">
                         <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 mb-4">
                            <TruckIcon />
                        </div>
                        <p className="font-semibold text-slate-700">You are not receiving new job offers.</p>
                        <p className="text-slate-500 mt-1">Go online to start accepting jobs.</p>
                    </div>
                </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Your Performance Score">
                    <div className="text-center">
                        <ScoreCircle score={performanceMetrics.score} />
                        <p className="mt-4 text-slate-600">Your overall driver score based on recent activity.</p>
                    </div>
                    <div className="mt-6 space-y-3 border-t border-slate-200 pt-4">
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-slate-700">On-Time Delivery Rate</p>
                            <p className="font-bold text-slate-800">{performanceMetrics.onTimeRate}%</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${performanceMetrics.onTimeRate}%` }}></div>
                        </div>
                    </div>
                     <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-slate-700">Job Acceptance Rate</p>
                            <p className="font-bold text-slate-800">{performanceMetrics.acceptanceRate}%</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${performanceMetrics.acceptanceRate}%` }}></div>
                        </div>
                    </div>
                </Card>

                <Card title="Earnings History">
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <p className="text-slate-600">Total Earnings</p>
                        <p className="text-3xl font-bold text-green-700">{formatCurrency(totalEarnings)}</p>
                    </div>
                    {completedJobs.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {completedJobs.map(job => (
                                <div key={job.id} className="p-3 border border-slate-200 rounded-md flex justify-between items-center gap-4">
                                    <div>
                                        <p className="font-semibold text-slate-800">{job.pickup_addr} → {job.drop_addr}</p>
                                        <p className="text-sm text-slate-500">
                                            Completed on: {job.completedAt ? new Date(job.completedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-green-600">{formatCurrency(job.payout || 0)}</p>
                                        <p className="text-xs text-slate-400 font-mono">ID: {job.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-4">You have no completed jobs yet.</p>
                    )}
                </Card>
            </div>

        </div>
    );
};

export default DriverDashboard;