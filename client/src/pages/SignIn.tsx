import { useAuth, type DemoUserRole } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("demo@iplicensing.app");
  const [role, setRole] = useState<DemoUserRole>("licensor");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sign in to IP Licensing (Demo Mode)</h1>
          <p className="text-muted-foreground mt-2">No backend required. Sign in info is stored in localStorage.</p>
        </div>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Role</Label>
            <select className="w-full border rounded-md h-10 px-3" value={role} onChange={(e) => setRole(e.target.value as DemoUserRole)}>
              <option value="licensor">Licensor</option>
              <option value="licensee">Licensee</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>
          <Button className="w-full" onClick={() => {
            signIn({ id: crypto.randomUUID(), name, email, role });
            setLocation(role === "licensor" ? "/dashboard" : role === "licensee" ? "/my-dashboard" : "/review-dashboard");
          }}>Sign In</Button>
          <Button variant="outline" className="w-full" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>
      </Card>
    </div>
  );
}
