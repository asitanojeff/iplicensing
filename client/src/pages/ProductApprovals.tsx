import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

type Item = { id: string; product: string; status: "Pending" | "Approved" | "Rejected" };
const KEY = "demo-approvals";
const seed: Item[] = [{ id: "1", product: "Summer Tee", status: "Pending" }, { id: "2", product: "Collector Mug", status: "Pending" }];
export default function Page() {
  const [items, setItems] = useState<Item[]>(() => JSON.parse(localStorage.getItem(KEY) || JSON.stringify(seed)));
  const update = (next: Item[]) => { setItems(next); localStorage.setItem(KEY, JSON.stringify(next)); };
  return <DashboardLayout><div className="space-y-6"><h1 className="text-3xl font-bold">Approvals (Demo Mode)</h1>
    {items.map(i => <Card key={i.id} className="p-4 flex items-center justify-between"><div><div className="font-medium">{i.product}</div><div className="text-sm text-muted-foreground">Status: {i.status}</div></div><div className="space-x-2"><Button onClick={() => update(items.map(x => x.id === i.id ? { ...x, status: "Approved" } : x))}>Approve</Button><Button variant="destructive" onClick={() => update(items.map(x => x.id === i.id ? { ...x, status: "Rejected" } : x))}>Reject</Button></div></Card>)}
  </div></DashboardLayout>;
}
