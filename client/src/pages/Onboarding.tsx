import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome to IP Licensing</h1>
          <p className="text-muted-foreground mt-2">Complete onboarding or jump directly to your workspace.</p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Get started checklist</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2">
            <li>Connect your organization profile.</li>
            <li>Upload your first IP asset.</li>
            <li>Create your first licensing contract.</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => setLocation("/dashboard")}>Open Dashboard</Button>
            <Button variant="outline" onClick={() => setLocation("/assets")}>View Assets</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
