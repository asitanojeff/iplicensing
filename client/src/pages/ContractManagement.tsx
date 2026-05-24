import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contracts</h1>
          <p className="text-muted-foreground">
            Create, track, and review licensing agreements.
          </p>
        </div>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Starter content for contracts.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
