import React, { useState, useEffect } from 'react';
import { notificationManager } from '../services/notificationManager';
import Button from './common/Button';

const NotificationPermissionBanner: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentPermission = notificationManager.getPermissionState();
    setPermission(currentPermission);
    if (currentPermission === 'default') {
      setIsVisible(true);
    }
  }, []);

  const handleRequestPermission = async () => {
    const newPermission = await notificationManager.requestPermission();
    setPermission(newPermission);
    if (newPermission !== 'default') {
      setIsVisible(false);
    }
    if (newPermission === 'granted') {
        notificationManager.showNotification('Thank you!', {
            body: 'You will now receive updates about your shipments.'
        });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-indigo-600 p-3 rounded-lg mb-6 animate-fade-in-down">
      <div className="flex items-center justify-between flex-wrap">
        <div className="w-0 flex-1 flex items-center">
          <span className="flex p-2 rounded-lg bg-indigo-800">
             <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
             </svg>
          </span>
          <p className="ml-3 font-medium text-white truncate">
            <span className="md:hidden">Get shipment updates!</span>
            <span className="hidden md:inline">Enable notifications to get real-time updates on your shipments.</span>
          </p>
        </div>
        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <Button onClick={handleRequestPermission} className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
            Enable Notifications
          </Button>
        </div>
        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <button type="button" onClick={handleDismiss} className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
            <span className="sr-only">Dismiss</span>
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;
