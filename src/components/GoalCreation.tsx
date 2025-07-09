
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Lock, DollarSign, Clock, Camera, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GoalCreation = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    habitName: '',
    targetAmount: '',
    interval: '',
    hardcoreMode: false,
    proofType: '',
    stakeAmount: '',
    deadlineTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating goal:', formData);
    
    toast({
      title: "Goal Created! 🔒",
      description: `You're locked in for $${formData.stakeAmount}. No backing out now.`,
      duration: 3000,
    });

    // Reset form
    setFormData({
      habitName: '',
      targetAmount: '',
      interval: '',
      hardcoreMode: false,
      proofType: '',
      stakeAmount: '',
      deadlineTime: ''
    });
  };

  const intervals = [
    { value: 'day', label: 'Daily', emoji: '📅' },
    { value: 'week', label: 'Weekly', emoji: '📊' },
    { value: 'month', label: 'Monthly', emoji: '🗓️' }
  ];

  const proofTypes = [
    { value: 'photo', label: 'Photo', emoji: '📸' },
    { value: 'screenshot', label: 'Screenshot', emoji: '💻' },
    { value: 'video', label: 'Video', emoji: '🎥' },
    { value: 'data', label: 'Data Upload', emoji: '📊' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          Lock In Your Future <Lock className="w-8 h-8 text-primary" />
        </h1>
        <p className="text-muted-foreground">
          Stop betting on others. Start betting on yourself.
        </p>
      </div>

      {/* Main Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Create Your Commitment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Habit Name */}
            <div className="space-y-2">
              <Label htmlFor="habitName">What's your commitment?</Label>
              <Input
                id="habitName"
                placeholder="e.g., Meditate, Exercise, Read, Code..."
                value={formData.habitName}
                onChange={(e) => setFormData({...formData, habitName: e.target.value})}
                className="text-lg"
                required
              />
            </div>

            {/* Target Amount & Interval */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="10"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Interval</Label>
                <Select value={formData.interval} onValueChange={(value) => setFormData({...formData, interval: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {intervals.map((interval) => (
                      <SelectItem key={interval.value} value={interval.value}>
                        <span className="flex items-center gap-2">
                          {interval.emoji} {interval.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview */}
            {formData.habitName && formData.targetAmount && formData.interval && (
              <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                <p className="text-center text-lg font-medium">
                  "{formData.habitName} {formData.targetAmount} minutes / {formData.interval}"
                </p>
              </div>
            )}

            {/* Hardcore Mode */}
            <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <Label htmlFor="hardcoreMode" className="font-semibold">Hardcore Mode</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  No mercy. No excuses. Maximum accountability.
                </p>
              </div>
              <Switch
                id="hardcoreMode"
                checked={formData.hardcoreMode}
                onCheckedChange={(checked) => setFormData({...formData, hardcoreMode: checked})}
              />
            </div>

            {/* Proof Type */}
            <div className="space-y-2">
              <Label>Proof Method</Label>
              <Select value={formData.proofType} onValueChange={(value) => setFormData({...formData, proofType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="How will you prove it?" />
                </SelectTrigger>
                <SelectContent>
                  {proofTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        {type.emoji} {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stake Amount */}
            <div className="space-y-2">
              <Label htmlFor="stakeAmount">Money on the Line</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="stakeAmount"
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  value={formData.stakeAmount}
                  onChange={(e) => setFormData({...formData, stakeAmount: e.target.value})}
                  className="pl-10 text-lg font-semibold"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Lost per missed {formData.interval || 'interval'}
              </p>
            </div>

            {/* Deadline Time */}
            <div className="space-y-2">
              <Label htmlFor="deadlineTime">Daily Deadline</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="deadlineTime"
                  type="time"
                  value={formData.deadlineTime}
                  onChange={(e) => setFormData({...formData, deadlineTime: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-lg py-6 bg-primary hover:bg-primary/90 red-glow"
              size="lg"
            >
              <Lock className="w-5 h-5 mr-2" />
              Lock In Goal 🔒
              {formData.stakeAmount && (
                <Badge variant="secondary" className="ml-2">
                  ${formData.stakeAmount}
                </Badge>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="text-center text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg">
        ⚠️ Once locked in, there's no backing out. Your money is at stake.
      </div>
    </div>
  );
};

export default GoalCreation;
