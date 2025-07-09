
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Timer, 
  DollarSign, 
  Upload, 
  Flame, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

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
      nextDeadline: '2024-01-17T23:59:00',
      status: 'safe',
      totalStaked: 150.00,
      lastProofSubmitted: '2024-01-10T22:30:00'
    }
  ]);

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) return 'OVERDUE';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 1) return `${minutes}m`;
    if (hours < 24) return `${hours}h ${minutes}m`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'danger': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const totalAtStake = goals.reduce((sum, goal) => sum + goal.totalStaked, 0);
  const activeGoals = goals.filter(goal => goal.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
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

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const timeLeft = getTimeUntilDeadline(goal.nextDeadline);
          const isUrgent = timeLeft.includes('h') && !timeLeft.includes('d');
          const isOverdue = timeLeft === 'OVERDUE';

          return (
            <Card 
              key={goal.id} 
              className={`glass-card hover:border-primary/50 transition-all cursor-pointer ${
                isOverdue ? 'pulse-red border-red-500/50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {goal.name}
                    {goal.hardcoreMode && <span className="text-sm">⚡</span>}
                  </CardTitle>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{goal.targetAmount} minutes / {goal.interval}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Streak */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold">{goal.streak} day streak</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-primary font-semibold">
                    <DollarSign className="w-3 h-3" />
                    {goal.stakeAmount.toFixed(2)}
                  </div>
                </div>

                {/* Deadline */}
                <div className={`p-3 rounded-lg border ${
                  isOverdue ? 'bg-red-500/20 border-red-500/50' :
                  isUrgent ? 'bg-yellow-500/20 border-yellow-500/50' :
                  'bg-muted/30 border-border/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {isOverdue ? 'OVERDUE!' : `${timeLeft} left`}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      by {goal.deadlineTime}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Proof 📸
                  </Button>
                  
                  {goal.lastProofSubmitted && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Last proof: {new Date(goal.lastProofSubmitted).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Risk Warning */}
                {isUrgent && (
                  <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    Submit proof soon or lose ${goal.stakeAmount}!
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Goal CTA */}
      <Card className="glass-card border-dashed border-primary/50 hover:border-primary transition-colors cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">➕</span>
          </div>
          <h3 className="font-semibold mb-2">Ready for Another Challenge?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Lock in another goal and put your money where your mouth is.
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            Create New Goal 🎯
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitDashboard;
