import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MembersPage } from './pages/MembersPage';
import { MemberProfilePage } from './pages/MemberProfilePage';
import { CommunityMapPage } from './pages/CommunityMapPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

// ─── Protected Route Wrapper ────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

// ─── Authenticated Shell with all protected routes ───────────────────────────
function AuthenticatedApp() {
  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/:memberId" element={<MemberProfilePage />} />
          <Route path="/communities" element={<CommunityMapPage />} />
          <Route path="/interventions" element={<InterventionsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppShell>
    </AppProvider>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Protected */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AuthenticatedApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
