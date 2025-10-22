'use client';

import { useState, useEffect } from 'react';

const CARING_MESSAGES = [
  "how's your day going? 🌙",
  "hope you're doing okay today ✨",
  "thinking of you — how are you feeling?",
  "checking in on you 💫",
  "how's everything been lately?",
  "just wanted to see how you are 🌿",
  "hope today's treating you well",
  "hey, how are you doing? ✨",
];

function getRandomMessage() {
  return CARING_MESSAGES[Math.floor(Math.random() * CARING_MESSAGES.length)];
}

export default function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [testSuccess, setTestSuccess] = useState(false);

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      console.log('Notifications supported. Current permission:', Notification.permission);
      setPermission(Notification.permission);
    } else {
      console.error('Notifications not supported in this browser');
    }

    // Load saved settings
    const enabled = localStorage.getItem('notificationsEnabled') === 'true';
    const savedTime = localStorage.getItem('notificationTime') || '09:00';
    console.log('Loaded settings:', { enabled, savedTime });
    setNotificationsEnabled(enabled);
    setNotificationTime(savedTime);

    // Schedule notifications if enabled
    if (enabled && Notification.permission === 'granted') {
      console.log('Scheduling notification for', savedTime);
      scheduleNotification(savedTime);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser doesn\'t support notifications 😢');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        scheduleNotification(notificationTime);

        // Show test notification
        new Notification('Slow Hour ✨', {
          body: 'notifications are on! you\'re all set',
          tag: 'setup',
          requireInteraction: false,
        });
      } else if (result === 'denied') {
        alert('Notifications were blocked. You can enable them in your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      alert('Could not request notification permission. Try again?');
    }
  };

  const scheduleNotification = (time: string) => {
    // Cancel any existing scheduled notifications
    const existingTimeout = localStorage.getItem('notificationTimeoutId');
    if (existingTimeout) {
      clearTimeout(parseInt(existingTimeout));
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    // If scheduled time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Slow Hour ✨', {
          body: getRandomMessage(),
          tag: 'daily-card',
          requireInteraction: false,
        });
      }

      // Schedule next day's notification
      scheduleNotification(time);
    }, timeUntilNotification);

    localStorage.setItem('notificationTimeoutId', timeoutId.toString());
  };

  const handleToggle = () => {
    if (!notificationsEnabled && permission !== 'granted') {
      requestPermission();
    } else {
      const newValue = !notificationsEnabled;
      setNotificationsEnabled(newValue);
      localStorage.setItem('notificationsEnabled', newValue.toString());

      if (newValue) {
        scheduleNotification(notificationTime);
      }
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setNotificationTime(newTime);
    localStorage.setItem('notificationTime', newTime);

    if (notificationsEnabled && permission === 'granted') {
      scheduleNotification(newTime);
    }
  };

  const testNotification = () => {
    console.log('Test button clicked. Permission:', permission);

    if (permission !== 'granted') {
      console.warn('Permission not granted:', permission);
      alert('Please enable notifications first! Current permission: ' + permission);
      return;
    }

    try {
      console.log('Creating test notification...');
      const message = getRandomMessage();
      console.log('Using message:', message);

      const notification = new Notification('Slow Hour ✨', {
        body: message,
        tag: 'test-' + Date.now(),
        requireInteraction: false,
      });

      notification.onclick = () => {
        console.log('Notification clicked!');
        window.focus();
        notification.close();
      };

      notification.onerror = (error) => {
        console.error('Notification error:', error);
      };

      notification.onshow = () => {
        console.log('Notification shown successfully!');
      };

      console.log('Test notification created:', notification);

      // Show visual confirmation
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 5000);
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Error: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-handwritten text-forest-900 mb-8">
        Notifications
      </h1>

      <div className="space-y-8">
        {/* Enable/Disable Toggle */}
        <div className="bg-cream-100/50 border border-forest-200 rounded-xl p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 pr-4">
              <h3 className="text-2xl font-light text-forest-900 mb-2">
                Daily Reminders
              </h3>
              <p className="text-forest-600 text-lg font-light">
                Get a gentle nudge when it's time to draw your card
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                notificationsEnabled ? 'bg-forest-500' : 'bg-forest-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-cream-50 transition-transform ${
                  notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {permission === 'denied' && (
            <p className="text-clay-600 text-base font-light mt-4 p-4 bg-clay-50 rounded-lg">
              Notifications are blocked. You'll need to enable them in your browser settings.
            </p>
          )}
        </div>

        {/* Time Picker */}
        {notificationsEnabled && permission === 'granted' && (
          <div className="bg-cream-100/50 border border-forest-200 rounded-xl p-8">
            <h3 className="text-2xl font-light text-forest-900 mb-6">
              What time works for you?
            </h3>
            <input
              type="time"
              value={notificationTime}
              onChange={handleTimeChange}
              className="w-full px-6 py-4 bg-cream-50 border border-forest-300 rounded-lg text-forest-900 font-light text-2xl focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
            <p className="text-forest-600 text-lg font-light mt-4">
              You'll get a notification at this time each day
            </p>
          </div>
        )}

        {/* Test Button */}
        {notificationsEnabled && permission === 'granted' && (
          <div>
            <button
              onClick={testNotification}
              className="w-full px-8 py-4 bg-forest-100 hover:bg-forest-200 text-forest-800 font-light rounded-xl transition-all text-xl"
            >
              Send Test Notification
            </button>

            {testSuccess && (
              <div className="mt-4 p-4 bg-sage-100 border border-sage-300 rounded-lg text-forest-900 text-lg font-light animate-fade-in">
                ✨ Notification sent!
                <br />
                <span className="text-base">If you don't see it: Check your system notification center, or your browser/OS might be blocking notifications even though you gave permission.</span>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-sage-50/50 border border-sage-200 rounded-xl p-8">
          <h4 className="text-2xl font-light text-forest-900 mb-4">
            How this works
          </h4>
          <ul className="text-forest-700 text-lg font-light space-y-3">
            <li>• Notifications work best on Android and desktop</li>
            <li>• On iPhone, keep Safari running in the background for best results</li>
            <li>• You can change your notification time anytime</li>
            <li>• Messages are gentle reminders, never pushy</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        {notificationsEnabled && permission === 'granted' && (
          <div className="bg-clay-50/50 border border-clay-200 rounded-xl p-8">
            <h4 className="text-2xl font-light text-forest-900 mb-4">
              Not seeing notifications?
            </h4>
            <ul className="text-forest-700 text-lg font-light space-y-3">
              <li>• <strong>Mac:</strong> Check System Settings → Notifications → Chrome/Safari</li>
              <li>• <strong>Windows:</strong> Check Settings → System → Notifications → Chrome</li>
              <li>• <strong>Do Not Disturb:</strong> Disable DND/Focus mode temporarily</li>
              <li>• <strong>Notification Center:</strong> Check your system notification center (top-right on Mac, bottom-right on Windows)</li>
              <li>• Try closing and reopening your browser</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
