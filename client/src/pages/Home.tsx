import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, Lock, BarChart3, FileCheck, Zap, Globe, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  const { isAuthenticated, logout, user } = useAuth();

  const scrollToFeatures = () => {
    document.getElementById("platform-features")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    const dashboardUrl =
      user?.role === "licensor"
        ? "/dashboard"
        : user?.role === "licensee"
          ? "/my-dashboard"
          : user?.role === "reviewer"
            ? "/review-dashboard"
            : "/dashboard";

    window.location.href = dashboardUrl;
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">IP</span>
            </div>
            <span className="font-semibold text-lg">IP Licensing</span>
          </div>
          <a href={getLoginUrl()} className="text-sm font-medium hover:text-accent transition-colors">
            Sign In
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-slideInUp">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Elegant IP Licensing Management
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline your entire licensing lifecycle with a refined, professional platform designed for managing IP assets, contracts, approvals, and royalties.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold" onClick={scrollToFeatures}>
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2 font-semibold"><Globe className="w-4 h-4 text-blue-500" /> Multi-territory ready</div>
              <p className="text-sm text-muted-foreground">Track royalties, approvals, and compliance by market with clean audit trails.</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2 font-semibold"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise-grade controls</div>
              <p className="text-sm text-muted-foreground">Role-based access, secure assets, and reviewer workflows built for real licensing teams.</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2 font-semibold"><Sparkles className="w-4 h-4 text-amber-500" /> Fast onboarding</div>
              <p className="text-sm text-muted-foreground">Launch a working licensing workspace in minutes and scale as operations grow.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="platform-features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Comprehensive Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 hover-lift group">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">IP Asset Bank</h3>
              <p className="text-muted-foreground">
                Securely store and manage all your IP materials with version control, download tracking, and granular permission management.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 hover-lift group">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Contract Management</h3>
              <p className="text-muted-foreground">
                Create, track, and manage licensing agreements with automatic key terms extraction and contract lifecycle management.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 hover-lift group">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Product Approvals</h3>
              <p className="text-muted-foreground">
                Streamlined 4-stage approval pipeline for product designs, packaging, and marketing materials with detailed feedback.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-8 hover-lift group">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Royalty Management</h3>
              <p className="text-muted-foreground">
                Automated royalty calculations, MG recoupment tracking, and comprehensive financial reporting with invoice generation.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-8 hover-lift group">
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Security Labels</h3>
              <p className="text-muted-foreground">
                QR code and serial number generation for anti-counterfeit verification with comprehensive label tracking.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-8 hover-lift group">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Real-time insights into royalty income, territory performance, and compliance metrics with visual reporting.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Role-Based Access */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Built for Different Roles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Licensor */}
            <Card className="p-8 border-2 border-blue-200 dark:border-blue-900/50">
              <h3 className="text-2xl font-bold mb-4">For Licensors</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Manage all IP assets and permissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Review and approve product submissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Track royalty income and compliance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Generate comprehensive reports</span>
                </li>
              </ul>
            </Card>

            {/* Licensee */}
            <Card className="p-8 border-2 border-green-200 dark:border-green-900/50">
              <h3 className="text-2xl font-bold mb-4">For Licensees</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>Access approved IP assets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>Submit products for approval</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>Submit quarterly royalty reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>Manage security labels</span>
                </li>
              </ul>
            </Card>

            {/* Reviewer */}
            <Card className="p-8 border-2 border-purple-200 dark:border-purple-900/50">
              <h3 className="text-2xl font-bold mb-4">For Reviewers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span>
                  <span>Review pending submissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span>
                  <span>Provide detailed feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span>
                  <span>Request revisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span>
                  <span>Approve final products</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your IP Licensing?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Join leading brands managing their IP licensing with elegance and precision.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-base font-semibold"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50 dark:bg-slate-800/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 IP Licensing Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
