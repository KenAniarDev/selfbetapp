import { auth } from "@/firebase/config";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api' || "https://localhost:7192/api";

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user");
      }
      return await user.getIdToken();
    } catch (error) {
      console.error("Error getting auth token:", error);
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
        throw new Error("Authentication required");
      }

      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return { data };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
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
    return this.makeRequest("/goals", {
      method: "POST",
      body: JSON.stringify(goalData),
    });
  }

  async getGoals(): Promise<ApiResponse> {
    return this.makeRequest("/goals");
  }

  async getGoal(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/goals/${id}`);
  }

  async updateGoal(
    id: string,
    goalData: Record<string, unknown>
  ): Promise<ApiResponse> {
    return this.makeRequest(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(goalData),
    });
  }

  async deleteGoal(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/goals/${id}`, {
      method: "DELETE",
    });
  }

  async submitProof(
    goalId: string,
    files: File[],
    description?: string
  ): Promise<ApiResponse> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();

      // Add all files to FormData
      files.forEach((file, index) => {
        formData.append("ProofFile", file);
      });

      // Add description if provided
      if (description) {
        formData.append("description", description);
      }

      const url = `${API_BASE_URL}/goals/${goalId}/proof`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return { data };
    } catch (error) {
      console.error("Proof submission failed:", error);
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async exportGoalHistory(
    goalId: string,
    format: "csv" = "csv"
  ): Promise<ApiResponse> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const url = `${API_BASE_URL}/goals/${goalId}/export?format=${format}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // For CSV export, we want to return the blob data
      const blob = await response.blob();
      return { data: blob };
    } catch (error) {
      console.error("Goal history export failed:", error);
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Payment method management
  async savePaymentMethod(paymentMethodData: {
    paymentMethodId: string;
  }): Promise<ApiResponse> {
    return this.makeRequest("/users/payment/save-payment-method", {
      method: "POST",
      body: JSON.stringify(paymentMethodData),
    });
  }

  async verifyCard() {
    return this.makeRequest("/users/payment/verify-card", {
      method: "POST",
    });
  }

  // User registration (no authentication required)
  async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse> {
    try {
      const url = `${API_BASE_URL}/users/register`;
      console.log("firstName:", userData.firstName);
      console.log("lastName:", userData.lastName);
      // Transform the payload to match the API's expected format
      const apiPayload = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      console.log("Registering user with payload:", apiPayload);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Return the error response for proper handling in the component
        return {
          error:
            data.message || `HTTP ${response.status}: ${response.statusText}`,
          data: data,
        };
      }

      return { data };
    } catch (error) {
      console.error("User registration failed:", error);
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
