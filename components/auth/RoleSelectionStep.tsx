import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import Button from '../common/Button';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import UserCircleIcon from '../icons/UserCircleIcon';

const RoleSelectionStep: React.FC = () => {
  const { selectRole, isLoading } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    selectRole(role);
  };

  return (
    <div className="animate-fade-in text-center">
      <h2 className="text-xl font-bold text-slate-800 mb-2">One last step!</h2>
      <p className="text-slate-600 mb-8">How will you be using TruckLink PK?</p>
      <div className="space-y-4">
        <Button
          onClick={() => handleRoleSelect('shipper')}
          disabled={isLoading}
          className="w-full text-lg py-4"
          variant="secondary"
        >
          <BriefcaseIcon />
          <span>I'm a Shipper (I have goods to move)</span>
        </Button>
        <Button
          onClick={() => handleRoleSelect('driver')}
          disabled={isLoading}
          className="w-full text-lg py-4"
          variant="secondary"
        >
          <UserCircleIcon />
          <span>I'm a Driver (I own a truck)</span>
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionStep;