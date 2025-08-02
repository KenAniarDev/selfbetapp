
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AddGoalCTA = () => {
  const navigate = useNavigate();

  const handleCreateGoal = () => {
    navigate('/create-goal');
  };

  return (
    <Card className="glass-card border-dashed border-primary/50 hover:border-primary transition-colors cursor-pointer">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">➕</span>
        </div>
        <h3 className="font-semibold mb-2">Ready for Another Challenge?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Lock in another goal and put your money where your mouth is.
        </p>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={handleCreateGoal}
        >
          Create New Goal 🎯
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddGoalCTA;
