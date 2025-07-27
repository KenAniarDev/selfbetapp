import { auth } from '@/firebase/config';

const API_BASE_URL = 'http://localhost:5033/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async createGoal(goalData: {
    name: string;
    targetAmount: number;
    interval: string;
    hardCoreMode: boolean;
    proofType: string;
    stakeAmount: number;
    deadlineTime: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async getGoals(): Promise<ApiResponse> {
    return this.makeRequest('/goals');
  }

  async getGoal(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/goals/${id}`);
  }

  async updateGoal(id: string, goalData: any): Promise<ApiResponse> {
    return this.makeRequest(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  }

  async deleteGoal(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  async submitProof(goalId: string, files: File[], description?: string): Promise<ApiResponse> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      
      // Add all files to FormData
      files.forEach((file, index) => {
        formData.append('ProofFile', file);
      });

      // Add description if provided
      if (description) {
        formData.append('description', description);
      }

      const url = `${API_BASE_URL}/goals/${goalId}/proof`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return { data };
    } catch (error) {
      console.error('Proof submission failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService; 