import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { clearIntakeStateStorage } from '../hooks/useIntakeState';

interface HomeNavButtonProps {
  className?: string;
}

export default function HomeNavButton({ className = '' }: HomeNavButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on intake route
  if (location.pathname === '/') {
    return null;
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    // Clear intake state before navigating to ensure fresh start
    clearIntakeStateStorage();
    navigate({ to: '/' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      clearIntakeStateStorage();
      navigate({ to: '/' });
    }
  };

  return (
    <Button
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      variant="ghost"
      size="icon"
      className={`text-foreground hover:bg-white/10 transition-colors ${className}`}
      aria-label="Go to home"
      type="button"
    >
      <Home className="h-5 w-5" />
      <span className="sr-only">Go to home</span>
    </Button>
  );
}
