import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Volume2, Crown, Tv, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import GlassTile from '../../components/GlassTile';
import {
  useGetSafeVolumeCap,
  useUpdateVolumeCap,
  useGetPremiumEnabled,
  useSetPremiumEnabled,
  useGetEnabledOTTProviders,
  useSetEnabledOTTProviders,
  useGetHeadsetBatteries,
} from '../../hooks/useQueries';
import { useState, useEffect } from 'react';
import { OTTProvider } from '../../backend';

const ottProviderLabels: Record<OTTProvider, string> = {
  [OTTProvider.netflix]: 'Netflix',
  [OTTProvider.primeVideo]: 'Amazon Prime Video',
  [OTTProvider.hotstar]: 'Disney+ Hotstar',
  [OTTProvider.youtube]: 'YouTube',
};

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { data: volumeCapData } = useGetSafeVolumeCap();
  const updateVolumeCap = useUpdateVolumeCap();
  const { data: premiumEnabled } = useGetPremiumEnabled();
  const setPremiumEnabled = useSetPremiumEnabled();
  const { data: enabledProviders = [] } = useGetEnabledOTTProviders();
  const setEnabledProviders = useSetEnabledOTTProviders();
  const { data: headsetBatteries = [] } = useGetHeadsetBatteries();

  const [localVolumeCap, setLocalVolumeCap] = useState(70);
  const [localPremium, setLocalPremium] = useState(false);
  const [localProviders, setLocalProviders] = useState<Set<OTTProvider>>(new Set());

  useEffect(() => {
    if (volumeCapData) {
      setLocalVolumeCap(Number(volumeCapData));
    }
  }, [volumeCapData]);

  useEffect(() => {
    if (premiumEnabled !== undefined) {
      setLocalPremium(premiumEnabled);
    }
  }, [premiumEnabled]);

  useEffect(() => {
    if (enabledProviders) {
      setLocalProviders(new Set(enabledProviders));
    }
  }, [enabledProviders]);

  const handleVolumeCapChange = (value: number[]) => {
    setLocalVolumeCap(value[0]);
  };

  const handleSaveVolumeCap = async () => {
    try {
      await updateVolumeCap.mutateAsync(BigInt(localVolumeCap));
    } catch (error) {
      console.error('Failed to update volume cap:', error);
    }
  };

  const handlePremiumToggle = async (checked: boolean) => {
    setLocalPremium(checked);
    try {
      await setPremiumEnabled.mutateAsync(checked);
    } catch (error) {
      console.error('Failed to update premium setting:', error);
      setLocalPremium(!checked);
    }
  };

  const handleProviderToggle = async (provider: OTTProvider, checked: boolean) => {
    const newProviders = new Set(localProviders);
    if (checked) {
      newProviders.add(provider);
    } else {
      newProviders.delete(provider);
    }
    setLocalProviders(newProviders);

    try {
      await setEnabledProviders.mutateAsync(Array.from(newProviders));
    } catch (error) {
      console.error('Failed to update OTT providers:', error);
      setLocalProviders(localProviders);
    }
  };

  const allProviders = [OTTProvider.netflix, OTTProvider.primeVideo, OTTProvider.hotstar, OTTProvider.youtube];

  return (
    <div className="min-h-screen bg-twilight p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Staff Dashboard</h1>
            <p className="text-foreground/70">Manage patient experience settings</p>
          </div>
        </div>

        <Tabs defaultValue="volume" className="w-full">
          <TabsList className="glass-panel border-white/10 w-full justify-start">
            <TabsTrigger value="volume">
              <Volume2 className="h-4 w-4 mr-2" />
              Volume Cap
            </TabsTrigger>
            <TabsTrigger value="premium">
              <Crown className="h-4 w-4 mr-2" />
              Premium
            </TabsTrigger>
            <TabsTrigger value="providers">
              <Tv className="h-4 w-4 mr-2" />
              OTT Providers
            </TabsTrigger>
            <TabsTrigger value="batteries">
              <Battery className="h-4 w-4 mr-2" />
              Headsets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="volume" className="space-y-4 mt-6">
            <GlassTile>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Safe Volume Limit</h3>
                  <p className="text-foreground/70">Set maximum volume for patient safety</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Current Limit</span>
                    <span className="text-2xl font-bold text-foreground">{localVolumeCap}%</span>
                  </div>
                  <Slider value={[localVolumeCap]} onValueChange={handleVolumeCapChange} max={100} step={5} />
                  <Button
                    onClick={handleSaveVolumeCap}
                    className="w-full btn-primary"
                    disabled={updateVolumeCap.isPending}
                  >
                    {updateVolumeCap.isPending ? 'Saving...' : 'Save Volume Cap'}
                  </Button>
                </div>
              </div>
            </GlassTile>
          </TabsContent>

          <TabsContent value="premium" className="space-y-4 mt-6">
            <GlassTile>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Premium Subscription</h3>
                  <p className="text-foreground/70">Enable premium features for patients</p>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="premium-toggle" className="text-foreground">
                    Premium Features
                  </Label>
                  <Switch
                    id="premium-toggle"
                    checked={localPremium}
                    onCheckedChange={handlePremiumToggle}
                    disabled={setPremiumEnabled.isPending}
                  />
                </div>
                {localPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    Premium Active
                  </Badge>
                )}
              </div>
            </GlassTile>
          </TabsContent>

          <TabsContent value="providers" className="space-y-4 mt-6">
            <GlassTile>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">OTT Providers</h3>
                  <p className="text-foreground/70">Enable or disable streaming platforms</p>
                </div>
                <div className="space-y-4">
                  {allProviders.map((provider) => (
                    <div key={provider} className="flex items-center justify-between">
                      <Label htmlFor={`provider-${provider}`} className="text-foreground">
                        {ottProviderLabels[provider]}
                      </Label>
                      <Switch
                        id={`provider-${provider}`}
                        checked={localProviders.has(provider)}
                        onCheckedChange={(checked) => handleProviderToggle(provider, checked)}
                        disabled={setEnabledProviders.isPending}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </GlassTile>
          </TabsContent>

          <TabsContent value="batteries" className="space-y-4 mt-6">
            {headsetBatteries.length === 0 ? (
              <GlassTile>
                <div className="text-center py-8">
                  <Battery className="h-12 w-12 mx-auto mb-4 text-foreground/50" />
                  <p className="text-foreground/70">No headset data available</p>
                </div>
              </GlassTile>
            ) : (
              headsetBatteries.map((battery) => (
                <GlassTile key={battery.deviceId}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-foreground">{battery.deviceId}</h3>
                      <p className="text-sm text-foreground/60">
                        Last updated: {new Date(Number(battery.lastUpdated)).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-foreground">{Number(battery.batteryLevel)}%</div>
                      <Badge
                        variant={Number(battery.batteryLevel) > 20 ? 'outline' : 'destructive'}
                        className="mt-1"
                      >
                        {Number(battery.batteryLevel) > 20 ? 'Good' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                </GlassTile>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
