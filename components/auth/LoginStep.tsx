import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import PhoneIcon from '../icons/PhoneIcon';

interface LoginStepProps {
  onSubmit: (phone: string) => void;
}

const LoginStep: React.FC<LoginStepProps> = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Basic validation for Pakistan phone number format
    if (!/^(?:\+92|0)3[0-9]{2}[0-9]{7}$/.test(phone)) {
        setError('Please enter a valid Pakistan mobile number (e.g., 03001234567 or +923001234567).');
        return;
    }
    onSubmit(phone);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Welcome!</h2>
      <p className="text-slate-600 text-center mb-6">Enter your phone number to sign in or create an account.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<PhoneIcon />}
          placeholder="03001234567"
          required
          autoComplete="tel"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Signing in...' : 'Sign In / Register'}
        </Button>
      </form>
    </div>
  );
};

export default LoginStep;