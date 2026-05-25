import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Send, Tag, TrendingUp } from "lucide-react";

export default function LicenseeDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your submissions, assets, and royalty reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assets Available</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <Download className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">My Submissions</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Send className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Labels Available</p>
                <p className="text-3xl font-bold">500</p>
              </div>
              <Tag className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Royalty Status</p>
                <p className="text-3xl font-bold">On Track</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start" onClick={() => window.location.assign("/my-assets")}>Download Assets</Button>
            <Button variant="outline" className="justify-start" onClick={() => window.location.assign("/my-submissions")}>Submit Product</Button>
            <Button variant="outline" className="justify-start" onClick={() => window.location.assign("/my-royalties")}>Submit Royalty Report</Button>
            <Button variant="outline" className="justify-start" onClick={() => window.location.assign("/my-labels")}>Manage Labels</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
