
import React, { useState, useCallback } from 'react';
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
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProofSubmission = () => {
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock goals data
  const goals = [
    {
      id: 1,
      name: 'Meditate',
      targetAmount: 20,
      interval: 'day',
      proofType: 'photo',
      deadline: '2024-01-15T21:00:00',
      stakeAmount: 25.00
    },
    {
      id: 2,
      name: 'Exercise',
      targetAmount: 45,
      interval: 'day',
      proofType: 'photo',
      deadline: '2024-01-15T18:00:00',
      stakeAmount: 50.00
    },
    {
      id: 3,
      name: 'Read',
      targetAmount: 30,
      interval: 'week',
      proofType: 'screenshot',
      deadline: '2024-01-17T23:59:00',
      stakeAmount: 75.00
    }
  ];

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
    
    // Simulate API call
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
    setIsSubmitting(false);
  };

  const getProofTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-4 h-4" />;
      case 'screenshot': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'data': return <FileText className="w-4 h-4" />;
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          Submit Proof <span className="text-2xl">📸</span>
        </h1>
        <p className="text-muted-foreground">
          Prove it or lose it. No excuses zone.
        </p>
      </div>

      {/* Goal Selection */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Select Goal to Prove</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {goals.map((goal) => {
              const timeInfo = getTimeUntilDeadline(goal.deadline);
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedGoal === goal.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  } ${timeInfo.urgent ? 'pulse-red' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{goal.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {goal.targetAmount} min / {goal.interval}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getProofTypeIcon(goal.proofType)}
                          {goal.proofType}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ${goal.stakeAmount}
                        </div>
                      </div>
                    </div>
                    <div className={`text-right ${timeInfo.urgent ? 'text-red-400' : 'text-muted-foreground'}`}>
                      <div className="text-sm font-medium">{timeInfo.text}</div>
                      <div className="text-xs">until deadline</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      {selectedGoal && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your Proof
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Drop files here or click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Photos, videos, or screenshots accepted
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Files:</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
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
              <label className="text-sm font-medium">
                Additional Notes (Optional)
              </label>
              <Textarea
                placeholder="Tell us about your achievement..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedGoal || uploadedFiles.length === 0 || isSubmitting}
              className="w-full text-lg py-6 bg-primary hover:bg-primary/90 disabled:opacity-50"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Submitting Proof...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Proof ✅
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Urgent Warning */}
      {selectedGoal && (() => {
        const goal = goals.find(g => g.id === selectedGoal);
        const timeInfo = goal ? getTimeUntilDeadline(goal.deadline) : null;
        return timeInfo?.urgent && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Urgent: Deadline Approaching!</p>
              <p className="text-sm text-red-300">
                Submit proof now or lose ${goal?.stakeAmount}
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ProofSubmission;
