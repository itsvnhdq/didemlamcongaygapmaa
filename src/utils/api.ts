import { apiService } from '../services/apiService';

/**
 * Simple API utility functions for easy use across the application
 */

// Generic API call function
export const apiCall = {
  /**
   * GET request - Usage: apiCall.get('/api/users')
   */
  get: async <T = any>(endpoint: string) => {
    try {
      const response = await apiService.get<T>(endpoint);
      return response.data;
    } catch (error: any) {
      console.error(`GET ${endpoint} failed:`, error);
      throw new Error(error.response?.data?.message || error.message || 'API request failed');
    }
  },

  /**
   * POST request - Usage: apiCall.post('/api/users', { name: 'John' })
   */
  post: async <T = any>(endpoint: string, data?: any) => {
    try {
      const response = await apiService.post<T>(endpoint, data);
      return response.data;
    } catch (error: any) {
      console.error(`POST ${endpoint} failed:`, error);
      throw new Error(error.response?.data?.message || error.message || 'API request failed');
    }
  },

  /**
   * PUT request - Usage: apiCall.put('/api/users/1', { name: 'Jane' })
   */
  put: async <T = any>(endpoint: string, data?: any) => {
    try {
      const response = await apiService.put<T>(endpoint, data);
      return response.data;
    } catch (error: any) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw new Error(error.response?.data?.message || error.message || 'API request failed');
    }
  },

  /**
   * DELETE request - Usage: apiCall.delete('/api/users/1')
   */
  delete: async <T = any>(endpoint: string) => {
    try {
      const response = await apiService.delete<T>(endpoint);
      return response.data;
    } catch (error: any) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw new Error(error.response?.data?.message || error.message || 'API request failed');
    }
  },

  /**
   * Get API base URL - Usage: const baseUrl = await apiCall.getBaseURL()
   */
  getBaseURL: async () => {
    return await apiService.getBaseURL();
  },

  /**
   * Health check - Usage: const isHealthy = await apiCall.healthCheck()
   */
  healthCheck: async () => {
    return await apiService.healthCheck();
  },

  /**
   * Force refresh API configuration - Usage: await apiCall.refresh()
   */
  refresh: async () => {
    return await apiService.forceRefresh();
  }
};

// Export default for convenience
export default apiCall;
