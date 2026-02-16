import { Monitor, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDisplayMode } from '../hooks/useDisplayMode';

export default function DashboardDisplayModeToggle() {
  const { displayMode, setDisplayMode } = useDisplayMode();

  const handleFrontActivate = (e: React.PointerEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplayMode('Front');
  };

  const handleBackActivate = (e: React.PointerEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplayMode('Back');
  };

  const handleFrontKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleFrontActivate(e);
    }
  };

  const handleBackKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleBackActivate(e);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-background/50 rounded-xl p-2">
      <Button
        variant={displayMode === 'Front' ? 'default' : 'ghost'}
        size="lg"
        onPointerDown={handleFrontActivate}
        onKeyDown={handleFrontKeyDown}
        aria-label="Front"
        aria-pressed={displayMode === 'Front'}
        className={`flex items-center gap-2 transition-all ${
          displayMode === 'Front' ? 'selected-glow' : ''
        }`}
      >
        <Monitor className="h-5 w-5" />
        <span className="font-medium">Front</span>
      </Button>
      <Button
        variant={displayMode === 'Back' ? 'default' : 'ghost'}
        size="lg"
        onPointerDown={handleBackActivate}
        onKeyDown={handleBackKeyDown}
        aria-label="Back"
        aria-pressed={displayMode === 'Back'}
        className={`flex items-center gap-2 transition-all ${
          displayMode === 'Back' ? 'selected-glow' : ''
        }`}
      >
        <MonitorSmartphone className="h-5 w-5" />
        <span className="font-medium">Back</span>
      </Button>
    </div>
  );
}
