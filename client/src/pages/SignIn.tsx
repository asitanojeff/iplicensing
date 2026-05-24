import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function SignIn() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sign in to IP Licensing</h1>
          <p className="text-muted-foreground mt-2">Use the secure authentication flow to continue.</p>
        </div>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => (window.location.href = getLoginUrl())}>Continue to Sign In</Button>
          <Button variant="outline" className="w-full" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>
      </Card>
    </div>
  );
}
