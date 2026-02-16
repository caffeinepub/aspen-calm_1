import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBackNavigation } from '../hooks/useBackNavigation';

interface BackNavButtonProps {
  className?: string;
}

export default function BackNavButton({ className = '' }: BackNavButtonProps) {
  const { goBack, canGoBack } = useBackNavigation();

  if (!canGoBack) {
    return null;
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    goBack();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goBack();
    }
  };

  return (
    <Button
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      variant="ghost"
      size="icon"
      className={`text-foreground hover:bg-white/10 transition-colors ${className}`}
      aria-label="Go back"
      type="button"
    >
      <ArrowLeft className="h-5 w-5" />
      <span className="sr-only">Go back</span>
    </Button>
  );
}
