import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Handle service worker updates
    const handleSWUpdate = () => {
      setShowUpdatePrompt(true);
    };

    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('sw-update-found', handleSWUpdate);
    
    // Check on mount
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('sw-update-found', handleSWUpdate);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleUpdateClick = () => {
    window.location.reload();
  };

  const handleDismiss = (type: 'install' | 'update') => {
    if (type === 'install') {
      setShowInstallPrompt(false);
    } else {
      setShowUpdatePrompt(false);
    }
  };

  if (!showInstallPrompt && !showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {showInstallPrompt ? 'Install App' : 'Update Available'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(showInstallPrompt ? 'install' : 'update')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {showInstallPrompt 
              ? 'Install this app on your device for a better experience'
              : 'A new version is available. Update to get the latest features.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              onClick={showInstallPrompt ? handleInstallClick : handleUpdateClick}
              className="flex-1"
            >
              {showInstallPrompt ? 'Install' : 'Update'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleDismiss(showInstallPrompt ? 'install' : 'update')}
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 