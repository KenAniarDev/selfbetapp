import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import GoalCard from './GoalCard';
import AddGoalCTA from './AddGoalCTA';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/utils/api';
import { Loader2 } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  interval: string;
  stakeAmount: number;
  deadlineTime: string;
  nextDeadlineDateTime: string;
  isActive: boolean;
  currentStreak: number;
  status: string;
  statusDescription: {
    message: string;
    timeDetail: string | null;
  };
  lastProofDate: string | null;
  displayStakeAmount: string;
  displayTarget: string;
}

const GoalsPage = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getGoals();
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Handle the new API response structure
      let transformedGoals: Goal[] = [];
      
      if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        // Goals are nested under response.data.data.data
        transformedGoals = response.data.data.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Fallback: if data is already an array
        transformedGoals = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Fallback: if data is already an array
        transformedGoals = response.data;
      } else {
        // Fallback to empty array
        transformedGoals = [];
      }

      setGoals(transformedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch goals');
      toast({
        title: "Error",
        description: "Failed to load your goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAtStake = Array.isArray(goals) ? goals.reduce((sum, goal) => sum + goal.stakeAmount, 0) : 0;
  const activeGoals = Array.isArray(goals) ? goals.filter(goal => goal.isActive).length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardHeader activeGoals={0} totalAtStake={0} />
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchGoals}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <DashboardHeader activeGoals={activeGoals} totalAtStake={totalAtStake} />

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No goals created yet.</p>
          <p className="text-sm text-muted-foreground">
            Create your first goal to start betting on yourself!
          </p>
        </div>
      )}

      {/* Add New Goal CTA */}
      <AddGoalCTA />
    </div>
  );
};

export default GoalsPage; 