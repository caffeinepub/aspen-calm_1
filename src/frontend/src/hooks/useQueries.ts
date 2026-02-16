import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, IntakeState, OTTSession, HeadsetBattery, Playlist, Language, OTTProvider, MediaProvider } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetIntakeState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IntakeState | null>({
    queryKey: ['intakeState'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getIntakeState();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveIntakeState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (state: IntakeState) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveIntakeState(state);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakeState'] });
    },
  });
}

export function useGetOTTSession() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OTTSession | null>({
    queryKey: ['ottSession'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOTTSession();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveOTTSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: OTTSession) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveOTTSession(session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ottSession'] });
    },
  });
}

export function useGetSafeVolumeCap() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['safeVolumeCap'],
    queryFn: async () => {
      if (!actor) return BigInt(70);
      return actor.getSafeVolumeCap();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateVolumeCap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cap: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVolumeCap(cap);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safeVolumeCap'] });
    },
  });
}

export function useGetHeadsetBatteries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HeadsetBattery[]>({
    queryKey: ['headsetBatteries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHeadsetBatteries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateHeadsetBattery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deviceId, batteryLevel }: { deviceId: string; batteryLevel: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      const timestamp = BigInt(Date.now());
      return actor.updateHeadsetBattery(deviceId, batteryLevel, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headsetBatteries'] });
    },
  });
}

export function useGetPremiumEnabled() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['premiumEnabled'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isPremiumEnabled();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetPremiumEnabled() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setPremiumEnabled(enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premiumEnabled'] });
    },
  });
}

export function useGetEnabledOTTProviders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OTTProvider[]>({
    queryKey: ['enabledOTTProviders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEnabledOTTProviders();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
  });
}

export function useSetEnabledOTTProviders() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (providers: OTTProvider[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setEnabledOTTProviders(providers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enabledOTTProviders'] });
    },
  });
}

export function useVerifyStaffPasscode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (passcode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyStaffPasscode(passcode);
    },
  });
}

export function useGetPlaylistsForLanguage(language: Language) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Playlist[]>({
    queryKey: ['playlists', language],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlaylistsForLanguage(language);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetActiveProviders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MediaProvider[]>({
    queryKey: ['activeProviders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveProviders();
    },
    enabled: !!actor && !actorFetching,
  });
}
