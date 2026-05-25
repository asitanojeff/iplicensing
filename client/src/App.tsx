import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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
import SignIn from "./pages/SignIn";
import Onboarding from "./pages/Onboarding";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/login" component={SignIn} />
      <Route path="/onboarding" component={Onboarding} />

      <Route path="/dashboard" component={LicensorDashboard} />
      <Route path="/licensor-dashboard" component={LicensorDashboard} />
      <Route path="/assets" component={AssetBank} />
      <Route path="/contracts" component={ContractManagement} />
      <Route path="/approvals" component={ProductApprovals} />
      <Route path="/royalties" component={RoyaltyReports} />
      <Route path="/analytics" component={Analytics} />

      <Route path="/my-dashboard" component={LicenseeDashboard} />
      <Route path="/licensee-dashboard" component={LicenseeDashboard} />
      <Route path="/my-assets" component={AssetBank} />
      <Route path="/my-submissions" component={ProductApprovals} />
      <Route path="/my-royalties" component={RoyaltyReports} />
      <Route path="/my-labels" component={SecurityLabels} />

      <Route path="/review-dashboard" component={ReviewerDashboard} />
      <Route path="/pending-approvals" component={ProductApprovals} />

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
