import { Monitor, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDisplayMode } from '../hooks/useDisplayMode';

export default function DisplayModeToggle() {
  const { displayMode, setDisplayMode } = useDisplayMode();

  const handleFrontClick = () => {
    setDisplayMode('Front');
  };

  const handleBackClick = () => {
    setDisplayMode('Back');
  };

  return (
    <div className="flex items-center gap-1 bg-background/50 rounded-lg p-1">
      <Button
        variant={displayMode === 'Front' ? 'default' : 'ghost'}
        size="icon"
        onClick={handleFrontClick}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleFrontClick();
        }}
        aria-label="Front"
        className={`h-8 w-8 transition-all ${
          displayMode === 'Front' ? 'selected-glow' : ''
        }`}
        title="Front"
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">Front</span>
      </Button>
      <Button
        variant={displayMode === 'Back' ? 'default' : 'ghost'}
        size="icon"
        onClick={handleBackClick}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleBackClick();
        }}
        aria-label="Back"
        className={`h-8 w-8 transition-all ${
          displayMode === 'Back' ? 'selected-glow' : ''
        }`}
        title="Back"
      >
        <MonitorSmartphone className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
    </div>
  );
}
