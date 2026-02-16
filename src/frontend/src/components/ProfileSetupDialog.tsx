import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim(), profileType: undefined });
      toast.success('Welcome to Aspen Calm!');
    } catch (error) {
      toast.error('Failed to save profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="glass-panel border-white/10" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Aspen Calm</DialogTitle>
          <DialogDescription className="text-base">
            Please tell us your name to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="glass-input"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full btn-primary" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
