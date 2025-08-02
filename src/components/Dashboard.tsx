import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/utils/api';
import { Loader2, TrendingUp, Target, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

const Dashboard = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGoals();
      
      if (response.error) {
        throw new Error(response.error);
      }

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
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const activeGoals = goals.filter(goal => goal.isActive);
  const totalAtStake = goals.reduce((sum, goal) => sum + goal.stakeAmount, 0);
  const totalStreaks = goals.reduce((sum, goal) => sum + goal.currentStreak, 0);
  const averageStreak = goals.length > 0 ? Math.round(totalStreaks / goals.length) : 0;

  const getProgressPercentage = (goal: Goal) => {
    // Calculate progress based on streak vs target
    const progress = Math.min((goal.currentStreak / goal.targetAmount) * 100, 100);
    return Math.round(progress);
  };

  // Prepare data for bar charts
  const streakChartData = activeGoals.map(goal => ({
    name: goal.name.length > 10 ? goal.name.substring(0, 10) + '...' : goal.name,
    streak: goal.currentStreak,
    target: goal.targetAmount,
    progress: getProgressPercentage(goal),
    stake: goal.stakeAmount,
    fullName: goal.name
  }));

  const progressChartData = activeGoals.map(goal => ({
    name: goal.name.length > 10 ? goal.name.substring(0, 10) + '...' : goal.name,
    progress: getProgressPercentage(goal),
    streak: goal.currentStreak,
    target: goal.targetAmount,
    fullName: goal.name
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          Dashboard 📊
        </h1>
        <p className="text-muted-foreground">
          Track your progress and performance across all goals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeGoals.length === 1 ? 'goal' : 'goals'} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total at Stake</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAtStake}</div>
            <p className="text-xs text-muted-foreground">
              Across all goals
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Streaks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStreaks}</div>
            <p className="text-xs text-muted-foreground">
              Combined streak count
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageStreak}</div>
            <p className="text-xs text-muted-foreground">
              Per goal average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Streak Comparison Bar Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Current Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={streakChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="streak" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    {streakChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3B82F6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active goals to display</p>
                <p className="text-sm">Create goals to see your streaks</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Bar Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Goal Progress (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="progress" fill="#10B981" radius={[4, 4, 0, 0]}>
                    {progressChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.progress >= 80 ? "#10B981" : entry.progress >= 50 ? "#F59E0B" : "#EF4444"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active goals to display</p>
                <p className="text-sm">Create goals to see your progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Goal Progress Bars */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => {
                const progress = getProgressPercentage(goal);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate">{goal.name}</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Streak: {goal.currentStreak}</span>
                      <span>Target: {goal.targetAmount}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active goals to display</p>
                <p className="text-sm">Create goals to see your progress</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Comparison */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Streak Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {goal.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🔥</span>
                    <span className="font-bold">{goal.currentStreak}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No streaks to compare</p>
                <p className="text-sm">Start building streaks to see comparison</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <p className="font-medium mb-2">Need to submit proof?</p>
              <p className="text-sm text-muted-foreground">
                Don't break your streak!
              </p>
            </div>
            <div className="text-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <p className="font-medium mb-2">Create new goal?</p>
              <p className="text-sm text-muted-foreground">
                Keep challenging yourself!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 