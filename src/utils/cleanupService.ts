
export class CleanupService {
  private static instance: CleanupService;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): CleanupService {
    if (!CleanupService.instance) {
      CleanupService.instance = new CleanupService();
    }
    return CleanupService.instance;
  }

  // Start automatic cleanup of expired unverified accounts
  startCleanup(intervalMinutes: number = 60) {
    if (this.cleanupInterval) {
      this.stopCleanup();
    }

    this.cleanupInterval = setInterval(async () => {
      try {
        await this.cleanupExpiredUnverifiedAccounts();
      } catch (error) {
        console.error('Cleanup failed:', error);
      }
    }, intervalMinutes * 60 * 1000); // Convert minutes to milliseconds

    console.log(`Cleanup service started with ${intervalMinutes} minute intervals`);
  }

  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Cleanup service stopped');
    }
  }

  private async cleanupExpiredUnverifiedAccounts() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/members/cleanup-expired-unverified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Cleanup completed:', result);
      }
    } catch (error) {
      console.error('Cleanup request failed:', error);
    }
  }

  // Manual cleanup trigger
  async triggerCleanup(): Promise<void> {
    await this.cleanupExpiredUnverifiedAccounts();
  }
}

export const cleanupService = CleanupService.getInstance();
