import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { apiService } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  interval: string;
  hardCoreMode: boolean;
  proofType: string;
  stakeAmount: number;
  deadlineTime: string;
}

interface DataExportProps {
  goals: Goal[];
  loading?: boolean;
}

const DataExport: React.FC<DataExportProps> = ({ goals, loading = false }) => {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!selectedGoal) {
      toast({
        title: "No goal selected",
        description: "Please select a goal to export its history.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const response = await apiService.exportGoalHistory(selectedGoal, 'csv');
      
      if (response.error) {
        toast({
          title: "Export failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      if (response.data instanceof Blob) {
        // Create download link
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        
        // Get goal name for filename
        const goal = goals.find(g => g.id === selectedGoal);
        const goalName = goal ? goal.name.replace(/[^a-zA-Z0-9]/g, '_') : 'goal';
        link.download = `${goalName}_history.csv`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Export successful",
          description: "Your goal history has been downloaded as a CSV file.",
        });
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An unexpected error occurred while exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Export Data
        </CardTitle>
        <CardDescription>
          Export your goal history as a CSV file to control your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Goal</label>
          <Select value={selectedGoal} onValueChange={setSelectedGoal} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading goals..." : "Choose a goal to export"} />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading goals...
                </SelectItem>
              ) : Array.isArray(goals) && goals.length > 0 ? (
                goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-goals" disabled>
                  No goals available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">What's included in the export:</p>
            <ul className="space-y-1 text-xs">
              <li>• Interval dates and target amounts</li>
              <li>• Actual amounts achieved</li>
              <li>• Proof submission status (Y/N)</li>
              <li>• Charge amounts and success status</li>
            </ul>
          </div>
        </div>

        <Button 
          onClick={handleExport}
          disabled={!selectedGoal || isExporting || loading}
          className="w-full flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export as CSV'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataExport; 