import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";

const records = [
  { period: "Q1 2026", licensee: "Acme Retail", gross: "$85,000", royalty: "$10,200", status: "Paid" },
  { period: "Q4 2025", licensee: "Nova Goods", gross: "$64,500", royalty: "$7,740", status: "Pending" },
  { period: "Q3 2025", licensee: "Metro Brand", gross: "$92,300", royalty: "$11,076", status: "Paid" },
];

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Royalties (Demo Mode)</h1>
        {records.map((r) => (
          <Card key={`${r.period}-${r.licensee}`} className="p-4">
            <div className="font-medium">{r.period} · {r.licensee}</div>
            <div className="text-sm text-muted-foreground">Gross: {r.gross} · Royalty: {r.royalty} · {r.status}</div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
