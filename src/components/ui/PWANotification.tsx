import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "./button";
import { usePWA } from "@/hooks/usePWA";

export const PWANotification = () => {
  const { isInstallable, isInstalled } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show notification after a delay if app is installable
    if (isInstallable && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Save to localStorage to avoid showing again
    localStorage.setItem("pwa-notification-dismissed", "true");
  };

  const handleInstall = () => {
    setIsVisible(false);
    // Installation will be handled by the usePWA hook
  };

  // Check if notification was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-notification-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Smartphone className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900">
              Install the app
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Install Curry Culum on your device for quick and offline access.
            </p>
            <div className="flex space-x-2 mt-3">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Download className="h-4 w-4 mr-1" />
                Install
              </Button>
              <Button size="sm" variant="outline" onClick={handleDismiss}>
                Later
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
