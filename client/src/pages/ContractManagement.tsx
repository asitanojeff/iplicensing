import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { readDemoStore, writeDemoStore } from "@/lib/demoData";
import { useMemo, useState } from "react";

export default function Page() {
  const [store, setStore] = useState(() => readDemoStore());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ipId: "ip-1", licenseeId: "lic-1", territory: "", royaltyRate: "", startDate: "", endDate: "" });

  const contracts = store.contracts;
  const selectedIp = useMemo(() => store.ipAssets.find((i) => i.id === form.ipId), [store.ipAssets, form.ipId]);

  const saveStore = (next: typeof store) => { setStore(next); writeDemoStore(next); };

  const saveContract = () => {
    if (!form.territory || !form.royaltyRate || !form.startDate || !form.endDate) return;
    const id = editingId ?? crypto.randomUUID();
    const nextContract = { id, ...form };
    const nextContracts = editingId ? contracts.map((c) => c.id === id ? nextContract : c) : [nextContract, ...contracts];
    saveStore({ ...store, contracts: nextContracts });
    setEditingId(null);
    setForm({ ipId: "ip-1", licenseeId: "lic-1", territory: "", royaltyRate: "", startDate: "", endDate: "" });
  };

  return <DashboardLayout><div className="space-y-6"><h1 className="text-3xl font-bold">Contract Management</h1>
  <Card className="p-4 grid md:grid-cols-3 gap-2">
    <Input value={selectedIp?.title ?? ""} disabled />
    <Input placeholder="Territory" value={form.territory} onChange={(e)=>setForm({...form,territory:e.target.value})}/>
    <Input placeholder="Royalty rate (%)" value={form.royaltyRate} onChange={(e)=>setForm({...form,royaltyRate:e.target.value})}/>
    <Input type="date" value={form.startDate} onChange={(e)=>setForm({...form,startDate:e.target.value})}/>
    <Input type="date" value={form.endDate} onChange={(e)=>setForm({...form,endDate:e.target.value})}/>
    <Button onClick={saveContract}>{editingId?"Update":"Add"} Contract</Button>
  </Card>
  {contracts.map(c=>{ const lic=store.licensees.find(l=>l.id===c.licenseeId); const ip=store.ipAssets.find(i=>i.id===c.ipId); return <Card key={c.id} className="p-4 flex justify-between"><div><div className="font-medium">{ip?.title} · {lic?.name}</div><div className="text-sm text-muted-foreground">{c.territory} · {c.royaltyRate}% · {c.startDate} to {c.endDate}</div></div><div className="space-x-2"><Button variant="outline" onClick={()=>{setEditingId(c.id);setForm({ipId:c.ipId,licenseeId:c.licenseeId,territory:c.territory,royaltyRate:c.royaltyRate,startDate:c.startDate,endDate:c.endDate});}}>Edit</Button><Button variant="destructive" onClick={()=>saveStore({...store,contracts:contracts.filter(x=>x.id!==c.id)})}>Delete</Button></div></Card>;})}
  </div></DashboardLayout>;
}
