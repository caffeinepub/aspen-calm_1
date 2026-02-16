import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingHintProps {
  children: React.ReactNode;
  className?: string;
}

export default function OnboardingHint({ children, className }: OnboardingHintProps) {
  return (
    <div className={cn('glass-panel border-white/10 p-4 rounded-xl', className)}>
      <div className="flex gap-3 items-start">
        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/80 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
