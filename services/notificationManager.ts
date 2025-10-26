class NotificationManager {
  private permission: NotificationPermission = 'default';

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public getPermissionState(): NotificationPermission {
    return this.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    }
    return 'denied';
  }

  public showNotification(title: string, options?: NotificationOptions): void {
    if (this.permission === 'granted') {
      new Notification(title, {
        body: 'This is a notification from Trukkr.',
        icon: '/favicon.ico', // Make sure you have a favicon
        ...options,
      });
    } else {
      console.warn('Notification permission not granted.');
    }
  }
}

// Export a singleton instance
export const notificationManager = new NotificationManager();
