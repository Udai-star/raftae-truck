import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthFlow from './components/auth/AuthFlow';
import ShipperDashboard from './components/shipper/ShipperDashboard';
import DriverDashboard from './components/driver/DriverDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LogoutIcon from './components/icons/LogoutIcon';
import UserIcon from './components/icons/UserIcon';
import NotificationPermissionBanner from './components/NotificationPermissionBanner';

const App: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'shipper':
        return <ShipperDashboard />;
      case 'driver':
        return <DriverDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        // This can happen if the user is new and hasn't selected a role yet.
        // AuthFlow component will handle this case.
        return <AuthFlow />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-lg font-semibold text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {user ? (
        <>
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  <span className="text-2xl font-bold text-indigo-600">TruckLink PK</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 text-sm">
                      <UserIcon />
                      <span className="font-medium">{user.phone}</span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">{user.role}</span>
                   </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-slate-600 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <NotificationPermissionBanner />
            {renderDashboard()}
          </main>
        </>
      ) : (
        <div className="pt-10">
          <AuthFlow />
        </div>
      )}
    </div>
  );
};

export default App;