import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HeadsetBattery {
    batteryLevel: bigint;
    lastUpdated: bigint;
    deviceId: string;
}
export interface Playlist {
    id: string;
    url: string;
    title: string;
    provider: MediaProvider;
    premiumFlag: SubscriptionFlag;
    language: Language;
    category: PlaylistCategory;
}
export interface OTTSession {
    provider: OTTProvider;
    lastTitle?: string;
    timestamp: bigint;
}
export interface IntakeState {
    mood?: Mood;
    vibe?: Vibe;
    language: Language;
    anxietyLevel: bigint;
    profile?: ProfileType;
}
export interface UserProfile {
    name: string;
    profileType?: ProfileType;
}
export enum Language {
    tamil = "tamil",
    hindi = "hindi",
    kannada = "kannada",
    telugu = "telugu",
    english = "english"
}
export enum MediaProvider {
    youtubeMusic = "youtubeMusic",
    spotify = "spotify",
    appleMusic = "appleMusic"
}
export enum Mood {
    distract = "distract",
    relax = "relax",
    listen = "listen"
}
export enum OTTProvider {
    netflix = "netflix",
    hotstar = "hotstar",
    primeVideo = "primeVideo",
    youtube = "youtube"
}
export enum PlaylistCategory {
    bollywoodClassics = "bollywoodClassics",
    upbeat = "upbeat",
    kannadaHits = "kannadaHits"
}
export enum ProfileType {
    kid = "kid",
    adult = "adult",
    teen = "teen",
    senior = "senior"
}
export enum SubscriptionFlag {
    premium = "premium",
    free = "free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Vibe {
    focus = "focus",
    nurture = "nurture",
    escape = "escape"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banProviders(providers: Array<MediaProvider>): Promise<void>;
    createPlaylist(playlist: Playlist): Promise<void>;
    deletePlaylist(playlistId: string): Promise<void>;
    getActiveProviders(): Promise<Array<MediaProvider>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEnabledOTTProviders(): Promise<Array<OTTProvider>>;
    getHeadsetBatteries(): Promise<Array<HeadsetBattery>>;
    getHeadsetBattery(deviceId: string): Promise<HeadsetBattery | null>;
    getIntakeState(): Promise<IntakeState | null>;
    getOTTSession(): Promise<OTTSession | null>;
    getPlaylistsForLanguage(language: Language): Promise<Array<Playlist>>;
    getRegionalAndExtraCategories(): Promise<Array<Playlist>>;
    getSafeVolumeCap(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isPremiumEnabled(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveIntakeState(state: IntakeState): Promise<void>;
    saveOTTSession(session: OTTSession): Promise<void>;
    setEnabledOTTProviders(providers: Array<OTTProvider>): Promise<void>;
    setPremiumEnabled(enabled: boolean): Promise<void>;
    updateHeadsetBattery(deviceId: string, batteryLevel: bigint, timestamp: bigint): Promise<void>;
    updateStaffPasscode(newPasscode: string): Promise<void>;
    updateVolumeCap(cap: bigint): Promise<void>;
    verifyStaffPasscode(passcode: string): Promise<boolean>;
}
