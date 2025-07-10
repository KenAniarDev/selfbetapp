
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Flame, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { getTimeUntilDeadline, getStatusColor } from '@/utils/habitUtils';

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  interval: string;
  stakeAmount: number;
  deadlineTime: string;
  hardcoreMode: boolean;
  proofType: string;
  streak: number;
  nextDeadline: string;
  status: string;
  totalStaked: number;
  lastProofSubmitted: string | null;
}

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const timeLeft = getTimeUntilDeadline(goal.nextDeadline);
  const isUrgent = timeLeft.includes('h') && !timeLeft.includes('d');
  const isOverdue = timeLeft === 'OVERDUE';

  return (
    <Card 
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
};

export default GoalCard;
