import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleTokenExpiration, isTokenExpired } from '../utils/auth';

interface ApiConfig {
  baseURL: string;
  port: number;
  isReady: boolean;
}

class ApiService {
  private config: ApiConfig = {
    baseURL: 'http://localhost:8000',
    port: 8000,
    isReady: true // Always ready since we're hardcoding port 8000
  };

  constructor() {
    console.log('🔧 API configured to use: http://localhost:8000');
  }

  /**
   * Get current API base URL
   */
  async getBaseURL(): Promise<string> {
    return this.config.baseURL;
  }

  /**
   * Get full URL for an endpoint
   */
  async getURL(endpoint: string): Promise<string> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.config.baseURL}${cleanEndpoint}`;
  }

  /**
   * Enhanced authentication headers with token validation
   */
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("authToken") || 
                  localStorage.getItem("access_token") || 
                  localStorage.getItem("token");
    
    // Check token expiration before using it
    if (token && isTokenExpired(token)) {
      handleTokenExpiration();
      return {};
    }
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Enhanced request method with token validation
   */
  private async makeRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const url = await this.getURL(endpoint);
    
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      data,
      timeout: 10000,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...config?.headers
      }
    };

    try {
      return await axios.request<T>(requestConfig);
    } catch (error: any) {
      // Handle token expiration
      if (error.response?.status === 401) {
        handleTokenExpiration();
      }

      // Log and re-throw error
      console.error(`API Error (${method} ${endpoint}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Generic GET request with enhanced error handling
   */
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>('GET', endpoint, undefined, config);
  }

  /**
   * Generic POST request with enhanced error handling
   */
  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, data, config);
  }

  /**
   * Generic PUT request with enhanced error handling
   */
  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, data, config);
  }

  /**
   * Generic DELETE request with enhanced error handling
   */
  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint, config);
  }

  /**
   * Health check - test Django API root
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseURL}/api/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Django might return 405 for GET on API root, which is still valid
      return response.ok || response.status === 405;
    } catch (error) {
      console.warn('Health check failed:', error);
      return false;
    }
  }

  /**
   * Force refresh - for compatibility with existing code
   */
  async forceRefresh(): Promise<void> {
    console.log('🔄 Force refresh called - using hardcoded port 8000');
    // Since we're hardcoded to port 8000, this is essentially a no-op
    // but we keep it for compatibility
    return Promise.resolve();
  }
}

// Export singleton instance
export const apiService = new ApiService();