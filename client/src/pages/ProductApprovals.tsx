import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Approvals</h1>
          <p className="text-muted-foreground">
            Review submissions and track approval status.
          </p>
        </div>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Starter content for approvals.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
