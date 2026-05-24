import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Asset = { id: string; name: string; category: string; notes: string };
const KEY = "demo-assets";
const read = (): Asset[] => JSON.parse(localStorage.getItem(KEY) || "[]");

export default function Page() {
  const [assets, setAssets] = useState<Asset[]>(() => read());
  const [form, setForm] = useState<Asset>({ id: "", name: "", category: "", notes: "" });

  const save = (next: Asset[]) => {
    setAssets(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  return <DashboardLayout><div className="space-y-6"><div><h1 className="text-3xl font-bold">IP Assets (Demo Mode)</h1></div>
    <Card className="p-4 grid md:grid-cols-4 gap-2">
      <Input placeholder="Asset name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <Button onClick={() => {
        if (!form.name) return;
        const id = form.id || crypto.randomUUID();
        const next = form.id ? assets.map(a => a.id === form.id ? { ...form, id } : a) : [{ ...form, id }, ...assets];
        save(next); setForm({ id: "", name: "", category: "", notes: "" });
      }}>{form.id ? "Update" : "Add"} Asset</Button>
    </Card>
    <div className="space-y-2">{assets.map((a) => <Card key={a.id} className="p-4 flex items-center justify-between"><div><div className="font-medium">{a.name}</div><div className="text-sm text-muted-foreground">{a.category} · {a.notes}</div></div><div className="space-x-2"><Button variant="outline" onClick={() => setForm(a)}>Edit</Button><Button variant="destructive" onClick={() => save(assets.filter(x => x.id !== a.id))}>Delete</Button></div></Card>)}</div>
  </div></DashboardLayout>;
}
