import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassTile from '../../../components/GlassTile';
import { useGetEnabledOTTProviders, useGetOTTSession, useSaveOTTSession } from '../../../hooks/useQueries';
import { SiNetflix, SiAmazonprime, SiYoutube } from 'react-icons/si';
import type { OTTProvider } from '../../../backend';
import { OTTProvider as OTTProviderEnum } from '../../../backend';
import { ottProviderUrls } from '../../../utils/externalLinks';

interface OTTProviderData {
  id: OTTProvider;
  name: string;
  icon: typeof SiNetflix;
  url: string;
  color: string;
}

const ottProviders: OTTProviderData[] = [
  {
    id: OTTProviderEnum.netflix,
    name: 'Netflix',
    icon: SiNetflix,
    url: ottProviderUrls[OTTProviderEnum.netflix],
    color: 'from-red-600 to-red-700',
  },
  {
    id: OTTProviderEnum.primeVideo,
    name: 'Amazon Prime Video',
    icon: SiAmazonprime,
    url: ottProviderUrls[OTTProviderEnum.primeVideo],
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: OTTProviderEnum.hotstar,
    name: 'Disney+ Hotstar',
    icon: SiNetflix,
    url: ottProviderUrls[OTTProviderEnum.hotstar],
    color: 'from-indigo-600 to-indigo-700',
  },
  {
    id: OTTProviderEnum.youtube,
    name: 'YouTube',
    icon: SiYoutube,
    url: ottProviderUrls[OTTProviderEnum.youtube],
    color: 'from-red-500 to-red-600',
  },
];

export default function Cinema() {
  const navigate = useNavigate();
  const { data: enabledProviders, isError: providersError, isLoading: providersLoading } = useGetEnabledOTTProviders();
  const { data: ottSession } = useGetOTTSession();
  const saveSession = useSaveOTTSession();

  const handleOpenProvider = async (provider: OTTProviderData) => {
    try {
      await saveSession.mutateAsync({
        provider: provider.id,
        lastTitle: undefined,
        timestamp: BigInt(Date.now()),
      });
      window.open(provider.url, '_blank');
    } catch (error) {
      console.error('Failed to save OTT session:', error);
      window.open(provider.url, '_blank');
    }
  };

  // Fallback to all providers if backend settings cannot be loaded
  const effectiveProviders = providersError || !enabledProviders ? ottProviders : ottProviders.filter((p) => enabledProviders.includes(p.id));
  const lastProvider = ottSession ? ottProviders.find((p) => p.id === ottSession.provider) : null;

  return (
    <div className="min-h-screen bg-twilight p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cinema</h1>
            <p className="text-foreground/70">Movies and entertainment</p>
          </div>
        </div>

        {lastProvider && (
          <div className="glass-panel border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-foreground/70">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Continue Watching</span>
            </div>
            <GlassTile onClick={() => handleOpenProvider(lastProvider)} className="border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${lastProvider.color}`}>
                    <lastProvider.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{lastProvider.name}</h3>
                    <p className="text-sm text-foreground/60">Last accessed</p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-foreground/50" />
              </div>
            </GlassTile>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Available Platforms</h2>
          {providersLoading ? (
            <div className="glass-panel border-white/10 p-8 text-center">
              <p className="text-foreground/70">Loading platforms...</p>
            </div>
          ) : effectiveProviders.length === 0 ? (
            <div className="glass-panel border-white/10 p-8 text-center">
              <p className="text-foreground/70">No streaming platforms are currently enabled</p>
            </div>
          ) : (
            effectiveProviders.map((provider) => {
              const ProviderIcon = provider.icon;
              return (
                <GlassTile key={provider.id} onClick={() => handleOpenProvider(provider)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${provider.color}`}>
                        <ProviderIcon className="h-10 w-10 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-semibold text-foreground">{provider.name}</h3>
                        <Badge variant="outline">Internet Required</Badge>
                      </div>
                    </div>
                    <ExternalLink className="h-6 w-6 text-foreground/50" />
                  </div>
                </GlassTile>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
