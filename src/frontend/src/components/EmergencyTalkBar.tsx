import { AlertCircle, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClinicalSafety } from '../hooks/useClinicalSafety';

interface EmergencyTalkBarProps {
  onEmergencyActivate?: () => void;
  bottomOffset?: number;
}

export default function EmergencyTalkBar({ onEmergencyActivate, bottomOffset = 0 }: EmergencyTalkBarProps) {
  const { emergencyTalkActive, activateEmergencyTalk, deactivateEmergencyTalk } = useClinicalSafety();

  const handleToggle = () => {
    if (emergencyTalkActive) {
      deactivateEmergencyTalk();
    } else {
      activateEmergencyTalk();
      onEmergencyActivate?.();
    }
  };

  return (
    <div 
      className="fixed left-0 right-0 z-50 p-4 bg-gradient-to-t from-background to-transparent pointer-events-none transition-all duration-300"
      style={{ 
        bottom: `${bottomOffset}px`,
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
      }}
    >
      <div className="container mx-auto max-w-2xl pointer-events-auto">
        <Button
          onClick={handleToggle}
          size="lg"
          className={`w-full h-16 text-lg font-semibold ${
            emergencyTalkActive
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg'
          }`}
        >
          {emergencyTalkActive ? (
            <>
              <Volume2 className="h-6 w-6 mr-2" />
              Resume Audio & Video
            </>
          ) : (
            <>
              <AlertCircle className="h-6 w-6 mr-2" />
              Emergency Talk - Mute & Pause All
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
