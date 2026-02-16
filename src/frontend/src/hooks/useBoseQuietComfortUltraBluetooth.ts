import { useState, useEffect, useCallback, useRef } from 'react';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface BluetoothState {
  status: ConnectionStatus;
  device: any | null;
  error: string | null;
  isSupported: boolean;
}

export function useBoseQuietComfortUltraBluetooth() {
  const [state, setState] = useState<BluetoothState>({
    status: 'disconnected',
    device: null,
    error: null,
    isSupported: typeof navigator !== 'undefined' && 'bluetooth' in navigator,
  });

  const deviceRef = useRef<any | null>(null);

  // Restore connection state from sessionStorage on mount
  useEffect(() => {
    if (!state.isSupported) return;

    const savedStatus = sessionStorage.getItem('bluetooth-status');
    if (savedStatus === 'connected') {
      // Reset to disconnected on page load (device connections don't persist across reloads)
      sessionStorage.setItem('bluetooth-status', 'disconnected');
    }
  }, [state.isSupported]);

  // Handle device disconnection
  const handleDisconnect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'disconnected',
      device: null,
    }));
    sessionStorage.setItem('bluetooth-status', 'disconnected');
  }, []);

  // Connect to Bose QuietComfort Ultra
  const connect = useCallback(async () => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: 'Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or another compatible browser.',
      }));
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        status: 'connecting',
        error: null,
      }));
      sessionStorage.setItem('bluetooth-status', 'connecting');

      // Request Bose QuietComfort Ultra device
      // Using generic audio service as Bose may not expose specific services
      const bluetooth = (navigator as any).bluetooth;
      const device = await bluetooth.requestDevice({
        filters: [
          { namePrefix: 'Bose QC' },
          { namePrefix: 'Bose QuietComfort' },
        ],
        optionalServices: ['battery_service', 'device_information'],
      });

      deviceRef.current = device;

      // Listen for disconnection
      device.addEventListener('gattserverdisconnected', handleDisconnect);

      // Connect to GATT server
      if (device.gatt) {
        await device.gatt.connect();
      }

      setState({
        status: 'connected',
        device,
        error: null,
        isSupported: true,
      });
      sessionStorage.setItem('bluetooth-status', 'connected');
    } catch (error: any) {
      console.error('Bluetooth connection error:', error);
      
      let errorMessage = 'Failed to connect to Bose QuietComfort Ultra headphones.';
      
      if (error.name === 'NotFoundError') {
        errorMessage = 'No Bose QuietComfort Ultra headphones found. Please make sure they are powered on and in pairing mode.';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Bluetooth access was denied. Please check your browser permissions.';
      } else if (error.message?.includes('User cancelled')) {
        errorMessage = 'Pairing was cancelled.';
      }

      setState((prev) => ({
        ...prev,
        status: 'disconnected',
        error: errorMessage,
      }));
      sessionStorage.setItem('bluetooth-status', 'disconnected');
    }
  }, [state.isSupported, handleDisconnect]);

  // Disconnect from device
  const disconnect = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    handleDisconnect();
  }, [handleDisconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (deviceRef.current) {
        deviceRef.current.removeEventListener('gattserverdisconnected', handleDisconnect);
      }
    };
  }, [handleDisconnect]);

  return {
    status: state.status,
    device: state.device,
    error: state.error,
    isSupported: state.isSupported,
    connect,
    disconnect,
  };
}
