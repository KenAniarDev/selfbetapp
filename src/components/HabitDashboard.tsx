
import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import GoalCard from './GoalCard';
import AddGoalCTA from './AddGoalCTA';

const HabitDashboard = () => {
  // Mock data - in real app this would come from API
  const [goals] = useState([
    {
      id: 1,
      name: 'Meditate',
      targetAmount: 20,
      interval: 'day',
      stakeAmount: 25.00,
      deadlineTime: '21:00',
      hardcoreMode: true,
      proofType: 'photo',
      streak: 7,
      nextDeadline: '2024-01-15T21:00:00',
      status: 'active',
      totalStaked: 175.00,
      lastProofSubmitted: '2024-01-14T20:45:00'
    },
    {
      id: 2,
      name: 'Exercise',
      targetAmount: 45,
      interval: 'day',
      stakeAmount: 50.00,
      deadlineTime: '18:00',
      hardcoreMode: false,
      proofType: 'photo',
      streak: 3,
      nextDeadline: '2024-01-15T18:00:00',
      status: 'warning',
      totalStaked: 150.00,
      lastProofSubmitted: null
    },
    {
      id: 3,
      name: 'Read',
      targetAmount: 30,
      interval: 'week',
      stakeAmount: 75.00,
      deadlineTime: '23:59',
      hardcoreMode: true,
      proofType: 'screenshot',
      streak: 2,
      nextDeadline: '2024-01-20T23:59:00',
      status: 'safe',
      totalStaked: 150.00,
      lastProofSubmitted: '2024-01-10T22:30:00'
    }
  ]);

  const totalAtStake = goals.reduce((sum, goal) => sum + goal.totalStaked, 0);
  const activeGoals = goals.filter(goal => goal.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <DashboardHeader activeGoals={activeGoals} totalAtStake={totalAtStake} />

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Add New Goal CTA */}
      <AddGoalCTA />
    </div>
  );
};

export default HabitDashboard;
