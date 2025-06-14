interface ApiConfig {
  baseURL: string;
  port: number;
  protocol: string;
  host: string;
}

class ApiConfigManager {
  private config: ApiConfig;
  private readonly DEFAULT_PORTS = [8000, 4000, 5000, 5001, 5002, 5003, 3001, 8080, 3000]; // Start with 8000 first
  private readonly PROTOCOL = 'http';
  private readonly HOST = 'localhost';
  private readonly HEALTH_ENDPOINTS = ['/api/', '/api/users/login/', '/health', '/'];

  constructor() {
    this.config = {
      baseURL: `${this.PROTOCOL}://${this.HOST}:8000`,
      port: 8000,
      protocol: this.PROTOCOL,
      host: this.HOST
    };
  }

  /**
   * Test if a port is accessible by making requests to health endpoints
   */
  private async testPort(port: number): Promise<boolean> {
    for (const endpoint of this.HEALTH_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`${this.PROTOCOL}://${this.HOST}:${port}${endpoint}`, {
          method: 'GET',
          signal: controller.signal,
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        clearTimeout(timeoutId);
        
        if (response.ok || response.status === 405) { // 405 Method Not Allowed is also valid for Django
          console.log(`✅ Server responded on port ${port} at endpoint ${endpoint}`);
          return true;
        }
      } catch (error) {
        // Continue to next endpoint
        continue;
      }
    }
    return false;
  }

  /**
   * Check if there's a port info file from the server
   */
  private async checkPortInfoFile(): Promise<number | null> {
    const possiblePaths = [
      '/.server-port.json',  // In public folder
      '/server-port.json'    // Alternative path
    ];

    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          if (data.port && typeof data.port === 'number') {
            console.log(`📄 Found port info file at ${path}: ${data.port}`);
            return data.port;
          }
        }
      } catch (error) {
        // Port info file not available at this path
        continue;
      }
    }
    return null;
  }

  /**
   * Detect the actual server port by testing common ports
   */
  async detectServerPort(): Promise<number> {
    console.log('🔍 Detecting server port...');
    
    // First try to get port from info file
    const filePort = await this.checkPortInfoFile();
    if (filePort && await this.testPort(filePort)) {
      console.log(`✅ Server found via info file on port: ${filePort}`);
      return filePort;
    }
    
    // Try the current configured port first (8000)
    if (await this.testPort(this.config.port)) {
      console.log(`✅ Server found on current port: ${this.config.port}`);
      return this.config.port;
    }

    // Try environment variable if available
    const envPort = parseInt(process.env.REACT_APP_API_PORT || '8000', 10);
    if (!isNaN(envPort) && await this.testPort(envPort)) {
      console.log(`✅ Server found on env port: ${envPort}`);
      return envPort;
    }

    // Try common development ports, starting with 8000
    for (const port of this.DEFAULT_PORTS) {
      console.log(`🔍 Testing port ${port}...`);
      if (await this.testPort(port)) {
        console.log(`✅ Server found on port: ${port}`);
        return port;
      }
    }

    console.warn('⚠️ No server found on any port, using default 8000');
    return 8000; // Default fallback to Django's common port
  }

  /**
   * Initialize and detect the correct API configuration
   */
  async initialize(): Promise<void> {
    try {
      const detectedPort = await this.detectServerPort();
      this.updateConfig(detectedPort);
      
      // Verify the connection works
      await this.verifyConnection();
    } catch (error) {
      console.error('❌ Error detecting server port:', error);
      // Keep default configuration
    }
  }

  /**
   * Verify that the API connection is working
   */
  private async verifyConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseURL}/api/`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 405) { // Django might return 405 for GET on API root
        console.log(`✅ API connection verified`);
        return true;
      }
    } catch (error) {
      console.warn('⚠️ API connection verification failed:', error);
    }
    return false;
  }

  /**
   * Update the API configuration with detected port
   */
  private updateConfig(port: number): void {
    this.config = {
      baseURL: `${this.PROTOCOL}://${this.HOST}:${port}`,
      port,
      protocol: this.PROTOCOL,
      host: this.HOST
    };
    
    console.log(`🔧 API configured to use: ${this.config.baseURL}`);
    
    // Store in localStorage for faster subsequent loads
    localStorage.setItem('api_port', port.toString());
    localStorage.setItem('api_config_timestamp', Date.now().toString());
  }

  /**
   * Get cached port if available and recent
   */
  private getCachedPort(): number | null {
    try {
      const cachedPort = localStorage.getItem('api_port');
      const timestamp = localStorage.getItem('api_config_timestamp');
      
      if (cachedPort && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        // Use cached port if less than 2 minutes old (reduced from 5)
        if (age < 2 * 60 * 1000) {
          return parseInt(cachedPort);
        } else {
          console.log('🔄 Cached port expired, clearing cache');
          this.clearCache();
        }
      }
    } catch (error) {
      // Ignore localStorage errors
    }
    return null;
  }

  /**
   * Clear cached configuration
   */
  public clearCache(): void {
    try {
      localStorage.removeItem('api_port');
      localStorage.removeItem('api_config_timestamp');
    } catch (error) {
      // Ignore localStorage errors
    }
  }

  /**
   * Quick initialization using cached port
   */
  async quickInit(): Promise<void> {
    const cachedPort = this.getCachedPort();
    if (cachedPort) {
      console.log(`🚀 Using cached port: ${cachedPort}`);
      this.updateConfig(cachedPort);
      
      // Verify in background
      this.verifyConnection().then(isValid => {
        if (!isValid) {
          console.log('🔄 Cached port invalid, re-detecting...');
          this.clearCache();
          this.initialize();
        }
      });
    } else {
      await this.initialize();
    }
  }

  /**
   * Get the current API base URL
   */
  getBaseURL(): string {
    return this.config.baseURL;
  }

  /**
   * Get the current port
   */
  getPort(): number {
    return this.config.port;
  }

  /**
   * Get full API configuration
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }

  /**
   * Manually set the port (useful for development)
   */
  setPort(port: number): void {
    this.updateConfig(port);
  }

  /**
   * Get API URL with endpoint
   */
  getURL(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.config.baseURL}${cleanEndpoint}`;
  }
}

// Create singleton instance
export const apiConfig = new ApiConfigManager();

// Initialize on module load with quick init for better performance
let initPromise: Promise<void> | null = null;

export const initializeApiConfig = (): Promise<void> => {
  if (!initPromise) {
    initPromise = apiConfig.quickInit();
  }
  return initPromise;
};

// Helper function to get API base URL (with auto-initialization)
export const getApiBaseURL = async (): Promise<string> => {
  await initializeApiConfig();
  return apiConfig.getBaseURL();
};

// Helper function to get API URL with endpoint
export const getApiURL = async (endpoint: string): Promise<string> => {
  await initializeApiConfig();
  return apiConfig.getURL(endpoint);
};

// Force re-detection (useful for development) - enhanced version
export const forcePortDetection = async (): Promise<void> => {
  console.log('🔄 Forcing port re-detection...');
  apiConfig.clearCache();
  initPromise = null;
  await apiConfig.initialize();
};

// Export default for backward compatibility
export default apiConfig;