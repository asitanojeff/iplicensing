import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { readDemoStore } from "@/lib/demoData";

export default function Page() {
  const store = readDemoStore();
  return <DashboardLayout><div className="space-y-6"><h1 className="text-3xl font-bold">Royalty Report</h1>
    {store.contracts.map((c) => {
      const licensee = store.licensees.find((l) => l.id === c.licenseeId);
      const royalty = (85000 * Number(c.royaltyRate || 0)) / 100;
      return <Card key={c.id} className="p-4"><div className="font-medium">FY 2026 · {licensee?.name}</div><div className="text-sm text-muted-foreground">Gross: $85,000 · Rate: {c.royaltyRate}% · Royalty Due: ${royalty.toLocaleString()}</div></Card>;
    })}
  </div></DashboardLayout>;
}
