
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Camera, 
  Image, 
  Video, 
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Loader2,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/utils/api';
import { Label } from '@/components/ui/label';

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

const ProofSubmission = () => {
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      // Handle the specific API response structure
      let transformedGoals: Goal[] = [];
      
      if (response.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        // Goals are nested under response.data.data
        transformedGoals = response.data.data.data;
      } else if (Array.isArray(response.data.data)) {
        // Fallback: if data is already an array
        transformedGoals = response.data.data;
      } else {
        // Fallback to empty array
        transformedGoals = [];
      }

      setGoals(transformedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedGoal || uploadedFiles.length === 0) return;

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual proof submission API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Proof Submitted! ✅",
        description: "Your proof is being reviewed. Keep that streak alive!",
        duration: 3000,
      });

      // Reset form
      setSelectedGoal(null);
      setUploadedFiles([]);
      setDescription('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit proof. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProofTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-4 h-4" />;
      case 'screenshot': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <Upload className="w-4 h-4" />;
    }
  };

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) return { text: 'OVERDUE', urgent: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 2) return { text: `${hours}h ${minutes}m`, urgent: true };
    if (hours < 24) return { text: `${hours}h ${minutes}m`, urgent: false };
    
    const days = Math.floor(hours / 24);
    return { text: `${days}d ${hours % 24}h`, urgent: false };
  };

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          Submit Your Proof 📸
        </h1>
        <p className="text-muted-foreground">
          Prove you did it. Keep your money. Build your streak.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Goal Selection */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Select Your Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active goals found.</p>
                <p className="text-sm text-muted-foreground">
                  Create a goal first to submit proof.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => {
                  const timeLeft = getTimeUntilDeadline(goal.nextDeadlineDateTime);
                  const isUrgent = timeLeft.urgent;
                  
                  return (
                    <div
                      key={goal.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedGoal === goal.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/30'
                      } ${isUrgent ? 'border-yellow-500/50 bg-yellow-500/10' : ''}`}
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{goal.name}</h3>
                        <Badge variant={isUrgent ? "destructive" : "secondary"}>
                          {timeLeft.text}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{goal.targetAmount} min / {goal.interval}</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {goal.stakeAmount}
                        </span>
                        <span className="flex items-center gap-1">
                          📸 Proof
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proof Upload */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              Upload Your Proof
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedGoal ? (
              <>
                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload Files</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-primary hover:text-primary/80"
                    >
                      Click to upload files
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Photos, videos, screenshots, or documents
                    </p>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="Describe what you accomplished..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={uploadedFiles.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Proof
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a goal to submit proof
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProofSubmission;
