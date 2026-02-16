import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassTileProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function GlassTile({ children, onClick, className }: GlassTileProps) {
  return (
    <Card
      className={cn(
        'glass-panel border-white/10 p-6 transition-all',
        onClick && 'cursor-pointer hover:scale-[1.02] hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]',
        className
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </Card>
  );
}
