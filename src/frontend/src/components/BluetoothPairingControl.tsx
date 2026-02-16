import { Bluetooth, BluetoothConnected, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBoseQuietComfortUltraBluetooth } from '../hooks/useBoseQuietComfortUltraBluetooth';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function BluetoothPairingControl() {
  const { status, error, isSupported, connect, disconnect } = useBoseQuietComfortUltraBluetooth();

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 5000,
      });
    }
  }, [error]);

  const handleClick = () => {
    if (status === 'connected') {
      disconnect();
    } else {
      connect();
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting…';
      case 'connected':
        return 'Connected';
      case 'disconnected':
      default:
        return 'Disconnected';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'disconnected':
      default:
        return 'text-muted-foreground';
    }
  };

  if (!isSupported) {
    return null; // Don't show control if Bluetooth is not supported
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={status === 'connecting'}
        className="text-foreground/80 hover:text-foreground relative"
        title={status === 'connected' ? 'Disconnect Bose QuietComfort Ultra' : 'Connect Bose QuietComfort Ultra'}
      >
        {status === 'connecting' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : status === 'connected' ? (
          <BluetoothConnected className="h-5 w-5" />
        ) : (
          <Bluetooth className="h-5 w-5" />
        )}
      </Button>
      
      <span className={`text-xs font-medium ${getStatusColor()} min-w-[90px] bluetooth-status`}>
        {getStatusLabel()}
      </span>
    </div>
  );
}
