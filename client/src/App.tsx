import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import LicensorDashboard from "./pages/LicensorDashboard";
import LicenseeDashboard from "./pages/LicenseeDashboard";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import AssetBank from "./pages/AssetBank";
import ContractManagement from "./pages/ContractManagement";
import ProductApprovals from "./pages/ProductApprovals";
import RoyaltyReports from "./pages/RoyaltyReports";
import SecurityLabels from "./pages/SecurityLabels";
import Analytics from "./pages/Analytics";

/**
 * Protected route wrapper - redirects to home if not authenticated
 */
function ProtectedRoute({
  component: Component,
  requiredRoles,
}: {
  component: React.ComponentType<any>;
  requiredRoles?: string[];
}) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Home />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role || "")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <Component />;
}

/**
 * Role-based dashboard router
 */
function DashboardRouter() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Home />;
  }

  const role = user?.role;

  return (
    <Switch>
      {/* Licensor routes */}
      {(role === "licensor" || role === "admin") && (
        <>
          <Route path="/dashboard" component={LicensorDashboard} />
          <Route path="/assets" component={AssetBank} />
          <Route path="/contracts" component={ContractManagement} />
          <Route path="/approvals" component={ProductApprovals} />
          <Route path="/royalties" component={RoyaltyReports} />
          <Route path="/analytics" component={Analytics} />
        </>
      )}

      {/* Licensee routes */}
      {(role === "licensee" || role === "admin") && (
        <>
          <Route path="/my-dashboard" component={LicenseeDashboard} />
          <Route path="/my-assets" component={AssetBank} />
          <Route path="/my-submissions" component={ProductApprovals} />
          <Route path="/my-royalties" component={RoyaltyReports} />
          <Route path="/my-labels" component={SecurityLabels} />
        </>
      )}

      {/* Reviewer routes */}
      {(role === "reviewer" || role === "admin") && (
        <>
          <Route path="/review-dashboard" component={ReviewerDashboard} />
          <Route path="/pending-approvals" component={ProductApprovals} />
        </>
      )}

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Dashboard and authenticated routes */}
      {isAuthenticated && (
        <Route path="/:rest*" component={DashboardRouter} />
      )}

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
