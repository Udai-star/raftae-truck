import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';

interface OtpStepProps {
  phone: string;
  mockOtp: string | null;
  onVerified: (isNewUser: boolean) => void;
  onGoBack: () => void;
}

const OtpStep: React.FC<OtpStepProps> = ({ phone, mockOtp, onVerified, onGoBack }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { verifyOtp, requestOtp, isLoading } = useAuth();
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (resendCooldown <= 0) {
      setIsResendDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { isNewUser } = await verifyOtp(phone, otp);
      onVerified(isNewUser);
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (isResendDisabled || isLoading) return;
    setError('');
    try {
      await requestOtp(phone);
      setIsResendDisabled(true);
      setResendCooldown(30);
    } catch (err) {
      setError("Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <div className="animate-fade-in">
       <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Enter Verification Code</h2>
       <p className="text-slate-600 text-center mb-4">A code has been sent to <strong>{phone}</strong>.</p>

       {mockOtp && (
        <div className="my-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
            <p className="text-sm text-slate-600">For this demo, please use the code below:</p>
            <p className="text-3xl font-bold tracking-widest text-indigo-700 mt-1">{mockOtp}</p>
        </div>
       )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="otp"
          name="otp"
          label="One-Time Password"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          required
          inputMode="numeric"
          pattern="\\d{6}"
          autoComplete="one-time-code"
        />
         {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm flex justify-center items-center gap-4">
        <button onClick={onGoBack} className="font-medium text-slate-600 hover:text-indigo-500">
            Change number
        </button>
        <div className="h-4 border-l border-slate-300"></div>
        <div>
            <span className="text-slate-600">Didn't receive it? </span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendDisabled || isLoading}
              className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-slate-400 disabled:cursor-not-allowed transition"
            >
              Resend
              {isResendDisabled && resendCooldown > 0 && ` in ${resendCooldown}s`}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OtpStep;