import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type Language = { #kannada; #hindi; #telugu; #tamil; #english };
  type ProfileType = { #kid; #teen; #adult; #senior };
  type Mood = { #relax; #distract; #listen };
  type Vibe = { #escape; #focus; #nurture };
  type MediaProvider = { #spotify; #youtubeMusic; #appleMusic };
  type SubscriptionFlag = { #free; #premium };
  type PlaylistCategory = { #kannadaHits; #bollywoodClassics; #upbeat };

  type IntakeState = {
    profile : ?ProfileType;
    anxietyLevel : Nat;
    mood : ?Mood;
    vibe : ?Vibe;
    language : Language;
  };

  type Playlist = {
    id : Text;
    title : Text;
    language : Language;
    category : PlaylistCategory;
    provider : MediaProvider;
    url : Text;
    premiumFlag : SubscriptionFlag;
  };

  // Extended OTTProvider type to include YouTube
  type OTTProvider = { #netflix; #primeVideo; #hotstar; #youtube };
  type OTTSession = {
    provider : OTTProvider;
    lastTitle : ?Text;
    timestamp : Nat;
  };

  type UserProfile = {
    name : Text;
    profileType : ?ProfileType;
  };

  type HeadsetBattery = {
    deviceId : Text;
    batteryLevel : Nat;
    lastUpdated : Nat;
  };

  // Extended staff settings to support YouTube
  type StaffSettings = {
    volumeCap : Nat;
    premiumEnabled : Bool;
    enabledOTTProviders : [OTTProvider];
    staffPasscode : Text;
  };

  // Stores
  let intakeStore = Map.empty<Principal, IntakeState>();
  let playlistStore = Map.empty<Text, Playlist>();
  let ottSessions = Map.empty<Principal, OTTSession>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let headsetBatteries = Map.empty<Text, HeadsetBattery>();

  // Global staff settings (not per-user)
  var globalBannedProviders : [MediaProvider] = [];
  var staffSettings : StaffSettings = {
    volumeCap = 70;
    premiumEnabled = false;
    enabledOTTProviders = [#netflix, #primeVideo, #hotstar, #youtube];
    staffPasscode = "admin123";
  };

  func arrayContains<T>(array : [T], value : T, compareFunc : (T, T) -> Bool) : Bool {
    for (element in array.values()) {
      if (compareFunc(element, value)) {
        return true;
      };
    };
    false;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func saveIntakeState(state : IntakeState) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save intake");
    };
    intakeStore.add(caller, state);
  };

  public query ({ caller }) func getIntakeState() : async ?IntakeState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch intake");
    };
    intakeStore.get(caller);
  };

  public query func getPlaylistsForLanguage(language : Language) : async [Playlist] {
    let allPlaylists = playlistStore.values().toArray();
    allPlaylists.filter<Playlist>(func(playlist) { playlist.language == language });
  };

  public shared ({ caller }) func createPlaylist(playlist : Playlist) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create playlists");
    };
    playlistStore.add(playlist.id, playlist);
  };

  public shared ({ caller }) func deletePlaylist(playlistId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete playlists");
    };
    playlistStore.remove(playlistId);
  };

  public query func getRegionalAndExtraCategories() : async [Playlist] {
    playlistStore.values().toArray();
  };

  public query func getActiveProviders() : async [MediaProvider] {
    let allProviders = [
      #spotify,
      #youtubeMusic,
      #appleMusic,
    ];
    allProviders.filter<MediaProvider>(
      func(provider) {
        not arrayContains(globalBannedProviders, provider, func(a, b) { a == b });
      },
    );
  };

  public shared ({ caller }) func saveOTTSession(session : OTTSession) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update OTT session");
    };
    ottSessions.add(caller, session);
  };

  public query ({ caller }) func getOTTSession() : async ?OTTSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get OTT session");
    };
    ottSessions.get(caller);
  };

  public shared ({ caller }) func banProviders(providers : [MediaProvider]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can ban providers");
    };
    globalBannedProviders := providers;
  };

  public query func getSafeVolumeCap() : async Nat {
    staffSettings.volumeCap;
  };

  public shared ({ caller }) func verifyStaffPasscode(passcode : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify staff passcode");
    };
    passcode == staffSettings.staffPasscode;
  };

  public shared ({ caller }) func updateStaffPasscode(newPasscode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update staff passcode");
    };
    staffSettings := {
      volumeCap = staffSettings.volumeCap;
      premiumEnabled = staffSettings.premiumEnabled;
      enabledOTTProviders = staffSettings.enabledOTTProviders;
      staffPasscode = newPasscode;
    };
  };

  public shared ({ caller }) func updateVolumeCap(cap : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update volume cap");
    };
    staffSettings := {
      volumeCap = cap;
      premiumEnabled = staffSettings.premiumEnabled;
      enabledOTTProviders = staffSettings.enabledOTTProviders;
      staffPasscode = staffSettings.staffPasscode;
    };
  };

  public shared ({ caller }) func setPremiumEnabled(enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle premium subscription");
    };
    staffSettings := {
      volumeCap = staffSettings.volumeCap;
      premiumEnabled = enabled;
      enabledOTTProviders = staffSettings.enabledOTTProviders;
      staffPasscode = staffSettings.staffPasscode;
    };
  };

  public query func isPremiumEnabled() : async Bool {
    staffSettings.premiumEnabled;
  };

  public shared ({ caller }) func setEnabledOTTProviders(providers : [OTTProvider]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage OTT providers");
    };
    staffSettings := {
      volumeCap = staffSettings.volumeCap;
      premiumEnabled = staffSettings.premiumEnabled;
      enabledOTTProviders = providers;
      staffPasscode = staffSettings.staffPasscode;
    };
  };

  public query func getEnabledOTTProviders() : async [OTTProvider] {
    staffSettings.enabledOTTProviders;
  };

  public shared ({ caller }) func updateHeadsetBattery(deviceId : Text, batteryLevel : Nat, timestamp : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update headset battery levels");
    };
    let battery : HeadsetBattery = {
      deviceId = deviceId;
      batteryLevel = batteryLevel;
      lastUpdated = timestamp;
    };
    headsetBatteries.add(deviceId, battery);
  };

  public query ({ caller }) func getHeadsetBatteries() : async [HeadsetBattery] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view headset battery levels");
    };
    headsetBatteries.values().toArray();
  };

  public query ({ caller }) func getHeadsetBattery(deviceId : Text) : async ?HeadsetBattery {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view headset battery levels");
    };
    headsetBatteries.get(deviceId);
  };
};
