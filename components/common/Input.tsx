
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, icon, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-400 sm:text-sm">{icon}</span>
          </div>
        )}
        <input
          id={id}
          className={`block w-full rounded-md border-slate-300 ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
