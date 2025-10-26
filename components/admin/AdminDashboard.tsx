import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input'; // Import the Input component
import { User, UserRole, UserStatus, Load } from '../../types';
import UsersIcon from '../icons/UsersIcon';
import TruckIcon from '../icons/TruckIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import CurrencyPkrIcon from '../icons/CurrencyPkrIcon';
import SearchIcon from '../icons/SearchIcon'; // Import the new SearchIcon

// --- MOCK DATA ---
const mockUsers: User[] = [
  { id: 'user_1', phone: '+923001234567', role: 'shipper', status: 'active', registeredAt: '2023-10-01T10:00:00Z' },
  { id: 'user_2', phone: '+923339876543', role: 'driver', status: 'active', registeredAt: '2023-10-02T11:30:00Z' },
  { id: 'user_3', phone: '+923215554433', role: 'shipper', status: 'suspended', registeredAt: '2023-10-03T14:15:00Z' },
  { id: 'user_4', phone: '+923118887766', role: 'driver', status: 'active', registeredAt: '2023-10-04T09:05:00Z' },
  { id: 'user_5', phone: '+923451122334', role: 'driver', status: 'active', registeredAt: '2023-10-05T16:45:00Z' },
  { id: 'user_6', phone: '+923001111111', role: 'admin', status: 'active', registeredAt: '2023-09-28T08:00:00Z' },
];

const mockLoads: (Omit<Load, 'category_required' | 'weight_tons' | 'goods_type' | 'shipper_id'> & { shipper: string, value: number })[] = [
  { id: 'LD58291', shipper: '+923001234567', pickup_addr: 'Karachi Port', drop_addr: 'Lahore Dry Port', status: 'in_transit', value: 85000 },
  { id: 'LD93742', shipper: '+923215554433', pickup_addr: 'Faisalabad', drop_addr: 'Multan', status: 'delivered', value: 45000 },
  { id: 'LD10934', shipper: '+923001234567', pickup_addr: 'Sialkot', drop_addr: 'Rawalpindi', status: 'pending', value: 32000 },
  { id: 'LD38475', shipper: '+923451122334', pickup_addr: 'Gwadar', drop_addr: 'Quetta', status: 'delivered', value: 110000 },
  { id: 'LD69201', shipper: '+923001234567', pickup_addr: 'Hyderabad', drop_addr: 'Sukkur', status: 'cancelled', value: 25000 },
];
// --- END MOCK DATA ---

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; }> = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-slate-200 flex items-center gap-4">
    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loadSearchQuery, setLoadSearchQuery] = useState('');
  
  const handleToggleUserStatus = (userId: string) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
          : user
      )
    );
  };

  const platformStats = useMemo(() => {
    const activeLoads = mockLoads.filter(l => l.status === 'in_transit').length;
    const completedTrips = mockLoads.filter(l => l.status === 'delivered').length;
    const totalRevenue = mockLoads
      .filter(l => l.status === 'delivered')
      .reduce((sum, load) => sum + load.value * 0.15, 0); // Assuming 15% platform fee
    return {
      totalUsers: users.length,
      activeLoads,
      completedTrips,
      totalRevenue: new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(totalRevenue),
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    const lowercasedQuery = userSearchQuery.toLowerCase();
    return users.filter(user =>
        user.phone.toLowerCase().includes(lowercasedQuery) ||
        user.status.toLowerCase().includes(lowercasedQuery)
    );
  }, [users, userSearchQuery]);

  const filteredLoads = useMemo(() => {
    if (!loadSearchQuery) return mockLoads;
     const lowercasedQuery = loadSearchQuery.toLowerCase();
     return mockLoads.filter(load =>
        load.id.toLowerCase().includes(lowercasedQuery) ||
        load.shipper.toLowerCase().includes(lowercasedQuery) ||
        load.status.toLowerCase().includes(lowercasedQuery)
     );
  }, [loadSearchQuery]);


  const roleStyles: Record<UserRole, string> = {
    shipper: 'bg-blue-100 text-blue-800',
    driver: 'bg-green-100 text-green-800',
    admin: 'bg-purple-100 text-purple-800',
  };

  const statusStyles: Record<UserStatus, string> = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<UsersIcon />} title="Total Users" value={platformStats.totalUsers.toString()} />
          <StatCard icon={<TruckIcon />} title="Active Loads" value={platformStats.activeLoads.toString()} />
          <StatCard icon={<CheckCircleIcon />} title="Completed Trips" value={platformStats.completedTrips.toString()} />
          <StatCard icon={<CurrencyPkrIcon />} title="Total Revenue" value={platformStats.totalRevenue} />
        </div>
      </section>

      <Card title="User Management">
        <div className="mb-4">
            <Input
              id="user-search"
              name="user-search"
              label=""
              placeholder="Search users by phone or status..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              icon={<SearchIcon />}
            />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registered On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${roleStyles[user.role!]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(user.registeredAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${statusStyles[user.status]}`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role !== 'admin' && (
                        <Button
                          onClick={() => handleToggleUserStatus(user.id)}
                          variant={user.status === 'active' ? 'secondary' : 'primary'}
                          size="sm"
                        >
                          {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Card title="Recent Loads Activity">
        <div className="mb-4">
            <Input
              id="load-search"
              name="load-search"
              label=""
              placeholder="Search loads by ID, shipper, or status..."
              value={loadSearchQuery}
              onChange={(e) => setLoadSearchQuery(e.target.value)}
              icon={<SearchIcon />}
            />
        </div>
         <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Load ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Shipper</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {filteredLoads.slice(0, 5).map(load => (
                    <tr key={load.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">{load.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{load.shipper}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{load.pickup_addr} → {load.drop_addr}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                load.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                load.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                                load.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>{load.status.replace('_', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-800">
                            {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(load.value)}
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
         </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;