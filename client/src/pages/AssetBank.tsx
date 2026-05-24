import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Asset Bank</h1>
          <p className="text-muted-foreground">
            Manage and organize your licensed IP assets.
          </p>
        </div>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Starter content for asset bank.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
