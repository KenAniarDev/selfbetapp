
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Lock, DollarSign, Clock, Camera, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import apiService from '@/utils/api';

const GoalCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    habitName: '',
    targetAmount: '',
    interval: '',
    hardcoreMode: false,
    proofType: '',
    stakeAmount: '',
    deadlineTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.habitName || !formData.targetAmount || !formData.interval || 
        !formData.proofType || !formData.stakeAmount || !formData.deadlineTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure time is in military format (HH:mm:ss)
      const formatMilitaryTime = (time: string): string => {
        if (!time) return '';
        // HTML time input provides HH:mm format, convert to HH:mm:ss
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const minute = parseInt(minutes);
        
        // Ensure proper formatting with leading zeros and add seconds
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
      };

      const goalData = {
        name: formData.habitName,
        targetAmount: parseFloat(formData.targetAmount),
        interval: formData.interval,
        hardCoreMode: formData.hardcoreMode,
        proofType: formData.proofType,
        stakeAmount: parseFloat(formData.stakeAmount),
        deadlineTime: formatMilitaryTime(formData.deadlineTime)
      };

      const response = await apiService.createGoal(goalData);

      if (response.error) {
        throw new Error(response.error);
      }

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

      // Navigate to goals page after successful creation
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error Creating Goal",
        description: error instanceof Error ? error.message : "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const intervals = [
    { value: 'daily', label: 'Daily', emoji: '📅' },
    { value: 'weekly', label: 'Weekly', emoji: '📊' },
    { value: 'monthly', label: 'Monthly', emoji: '🗓️' }
  ];

  const proofTypes = [
    { value: 'photo', label: 'Photo', emoji: '📸' },
    { value: 'screenshot', label: 'Screenshot', emoji: '💻' },
    { value: 'video', label: 'Video', emoji: '🎥' },
    { value: 'text', label: 'Text', emoji: '📝' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Goals
          </Button>
        </div>
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label>Interval</Label>
                <Select 
                  value={formData.interval} 
                  onValueChange={(value) => setFormData({...formData, interval: value})}
                  disabled={isSubmitting}
                >
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
                disabled={isSubmitting}
              />
            </div>

            {/* Proof Type */}
            <div className="space-y-2">
              <Label>Proof Method</Label>
              <Select 
                value={formData.proofType} 
                onValueChange={(value) => setFormData({...formData, proofType: value})}
                disabled={isSubmitting}
              >
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
                  placeholder="25"
                  value={formData.stakeAmount}
                  onChange={(e) => setFormData({...formData, stakeAmount: e.target.value})}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                How much are you willing to lose if you fail?
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
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                When do you need to complete this by each day?
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Goal...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Lock In My Future
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalCreation;
