import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignIn() {
  const { signIn } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sign in to IP Licensing</h1>
          <p className="text-muted-foreground mt-2">Demo mode uses a local mock session. No OAuth or backend is required.</p>
        </div>
        <Button className="w-full" onClick={() => { signIn(); setLocation("/dashboard"); }}>
          Enter Demo Dashboard
        </Button>
      </Card>
    </div>
  );
}
