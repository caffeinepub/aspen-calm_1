import { useContext } from 'react';
import { MediaActivityContext } from '../contexts/MediaActivityContext';

export function useMediaActivity() {
  const context = useContext(MediaActivityContext);
  
  if (!context) {
    throw new Error('useMediaActivity must be used within a MediaActivityProvider');
  }
  
  return context;
}
