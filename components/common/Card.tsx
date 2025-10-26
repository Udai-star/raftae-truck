
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="border border-slate-200 rounded-lg p-5">
      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default Card;
