import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import IntakeFlow from './pages/Intake/IntakeFlow';
import Dashboard from './pages/Dashboard/Dashboard';
import AudioPharmacy from './pages/Modules/AudioPharmacy/AudioPharmacy';
import NowPlaying from './pages/Modules/AudioPharmacy/NowPlaying';
import RegionalRadio from './pages/Modules/RegionalRadio/RegionalRadio';
import Cinema from './pages/Modules/Cinema/Cinema';
import VisualEscapes from './pages/Modules/VisualEscapes/VisualEscapes';
import Audiobooks from './pages/Modules/Audiobooks/Audiobooks';
import StaffDashboard from './pages/Staff/StaffDashboard';
import TopBar from './components/TopBar';
import BottomBars from './components/BottomBars';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useDisplayMode } from './hooks/useDisplayMode';
import { PlaybackProvider } from './contexts/PlaybackContext';
import { MediaActivityProvider } from './contexts/MediaActivityContext';

function Layout() {
  const { displayMode } = useDisplayMode();
  
  return (
    <div className="min-h-screen bg-background" data-display-mode={displayMode}>
      <TopBar />
      <BottomBars>
        <main className="pt-16">
          <Outlet />
        </main>
      </BottomBars>
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IntakeFlow,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const audioPharmacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio-pharmacy',
  component: AudioPharmacy,
});

const nowPlayingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/now-playing/$programId',
  component: NowPlaying,
});

const regionalRadioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/regional-radio',
  component: RegionalRadio,
});

const cinemaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cinema',
  component: Cinema,
});

const visualEscapesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visual-escapes',
  component: VisualEscapes,
});

const audiobooksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audiobooks',
  component: Audiobooks,
});

const staffDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: StaffDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  audioPharmacyRoute,
  nowPlayingRoute,
  regionalRadioRoute,
  cinemaRoute,
  visualEscapesRoute,
  audiobooksRoute,
  staffDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <PlaybackProvider>
        <MediaActivityProvider>
          <RouterProvider router={router} />
        </MediaActivityProvider>
      </PlaybackProvider>
    </ThemeProvider>
  );
}
