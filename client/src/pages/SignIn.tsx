import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignIn() {
  const { signIn, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sign in to IP Licensing</h1>
          <p className="text-muted-foreground mt-2">Use secure OAuth authentication to access your role-based dashboard.</p>
        </div>
        <Button className="w-full" onClick={signIn} disabled={loading}>
          Continue with OAuth
        </Button>
      </Card>
    </div>
  );
}
