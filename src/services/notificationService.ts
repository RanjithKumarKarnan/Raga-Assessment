interface CustomNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;

  async initialize() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', this.swRegistration);
        
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async showNotification(title: string, options?: CustomNotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notificationOptions: CustomNotificationOptions = {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options
      };
      
      if (this.swRegistration) {
        await this.swRegistration.showNotification(title, notificationOptions);
      } else {
        new Notification(title, notificationOptions);
      }
    }
  }

  async scheduleDailyReport() {
    // Schedule a daily analytics report notification
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM
    
    const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.showNotification('Daily Analytics Report Ready', {
        body: 'Your daily healthcare analytics report is now available.'
      });
      
      // Schedule for next day
      this.scheduleDailyReport();
    }, timeUntilTomorrow);
  }

  async notifyNewPatient(patientName: string) {
    await this.showNotification('New Patient Added', {
      body: `${patientName} has been added to the patient database.`,
      tag: 'new-patient',
      requireInteraction: true
    });
  }
}

export const notificationService = new NotificationService();
