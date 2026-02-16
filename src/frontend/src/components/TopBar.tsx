import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguagePreference } from '../hooks/useLanguagePreference';
import StaffEntryGesture from './StaffEntryGesture';
import DisplayModeToggle from './DisplayModeToggle';
import BluetoothPairingControl from './BluetoothPairingControl';
import BackNavButton from './BackNavButton';
import HomeNavButton from './HomeNavButton';
import type { Language } from '../backend';
import { Language as LanguageEnum } from '../backend';
import { useLocation } from '@tanstack/react-router';
import { getAssetUrl } from '../utils/assetUrl';
import { useState } from 'react';

const languages: { value: Language; label: string }[] = [
  { value: LanguageEnum.english, label: 'English' },
  { value: LanguageEnum.kannada, label: 'ಕನ್ನಡ (Kannada)' },
  { value: LanguageEnum.hindi, label: 'हिन्दी (Hindi)' },
  { value: LanguageEnum.telugu, label: 'తెలుగు (Telugu)' },
  { value: LanguageEnum.tamil, label: 'தமிழ் (Tamil)' },
];

// Normalize pathname to match useDisplayMode logic
function normalizePathname(pathname: string): string {
  return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
}

const routesWithDisplayToggle = [
  '/',
  '/dashboard',
  '/audio-pharmacy',
  '/regional-radio',
  '/cinema',
  '/visual-escapes',
  '/audiobooks',
  '/staff',
];

export default function TopBar() {
  const { language, setLanguage } = useLanguagePreference();
  const location = useLocation();
  const [logoError, setLogoError] = useState(false);
  
  const normalizedPath = normalizePathname(location.pathname);
  const showDisplayToggle = 
    routesWithDisplayToggle.includes(normalizedPath) ||
    normalizedPath.startsWith('/now-playing/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackNavButton />
          <HomeNavButton />
          
          <StaffEntryGesture>
            <div className="flex items-center gap-3 cursor-pointer">
              {!logoError && (
                <img
                  src={getAssetUrl('assets/generated/aspen-calm-logo.dim_1024x256.png')}
                  alt="Aspen Calm"
                  className="h-8 object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
              {logoError && (
                <span className="text-xl font-bold text-foreground">Aspen Calm</span>
              )}
            </div>
          </StaffEntryGesture>
        </div>

        <div className="flex items-center gap-3">
          {showDisplayToggle && <DisplayModeToggle />}
          
          <BluetoothPairingControl />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel border-white/10">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`cursor-pointer ${
                    language === lang.value ? 'bg-primary/20 text-primary font-semibold' : ''
                  }`}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
