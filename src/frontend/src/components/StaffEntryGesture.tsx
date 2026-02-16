import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyStaffPasscode } from '../hooks/useQueries';
import { useStaffSettings } from '../hooks/useStaffSettings';
import { toast } from 'sonner';

interface StaffEntryGestureProps {
  children: React.ReactNode;
}

export default function StaffEntryGesture({ children }: StaffEntryGestureProps) {
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
  const [passcode, setPasscode] = useState('');
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const verifyPasscode = useVerifyStaffPasscode();
  const { authenticateStaff } = useStaffSettings();
  const navigate = useNavigate();

  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowPasscodeDialog(true);
    }, 2000);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isValid = await verifyPasscode.mutateAsync(passcode);
      if (isValid) {
        authenticateStaff();
        setShowPasscodeDialog(false);
        setPasscode('');
        navigate({ to: '/staff' });
      } else {
        toast.error('Invalid passcode');
      }
    } catch (error) {
      toast.error('Failed to verify passcode');
      console.error(error);
    }
  };

  return (
    <>
      <div
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
      >
        {children}
      </div>

      <Dialog open={showPasscodeDialog} onOpenChange={setShowPasscodeDialog}>
        <DialogContent className="glass-panel border-white/10">
          <DialogHeader>
            <DialogTitle>Staff Access</DialogTitle>
            <DialogDescription>Enter staff passcode to continue</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasscodeSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="passcode">Passcode</Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="glass-input"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPasscodeDialog(false);
                  setPasscode('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 btn-primary" disabled={verifyPasscode.isPending}>
                {verifyPasscode.isPending ? 'Verifying...' : 'Access'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
