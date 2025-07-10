
import React from 'react';
import { Target, DollarSign } from 'lucide-react';

interface DashboardHeaderProps {
  activeGoals: number;
  totalAtStake: number;
}

const DashboardHeader = ({ activeGoals, totalAtStake }: DashboardHeaderProps) => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
        Your Commitments <span className="text-2xl">🔒</span>
      </h1>
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4 text-primary" />
          <span>{activeGoals} Active Goals</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-primary" />
          <span>${totalAtStake.toFixed(2)} at Stake</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
