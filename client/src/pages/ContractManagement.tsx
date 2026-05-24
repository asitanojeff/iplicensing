import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Contract = { id: string; partner: string; territory: string; rate: string };
const KEY = "demo-contracts";
const read = (): Contract[] => JSON.parse(localStorage.getItem(KEY) || "[]");

export default function Page() {
  const [contracts, setContracts] = useState<Contract[]>(() => read());
  const [form, setForm] = useState<Contract>({ id: "", partner: "", territory: "", rate: "" });
  const save = (next: Contract[]) => { setContracts(next); localStorage.setItem(KEY, JSON.stringify(next)); };
  return <DashboardLayout><div className="space-y-6"><h1 className="text-3xl font-bold">Contracts (Demo Mode)</h1>
  <Card className="p-4 grid md:grid-cols-4 gap-2">
    <Input placeholder="Partner" value={form.partner} onChange={(e)=>setForm({...form,partner:e.target.value})}/>
    <Input placeholder="Territory" value={form.territory} onChange={(e)=>setForm({...form,territory:e.target.value})}/>
    <Input placeholder="Royalty rate" value={form.rate} onChange={(e)=>setForm({...form,rate:e.target.value})}/>
    <Button onClick={()=>{ if(!form.partner) return; const id=form.id||crypto.randomUUID(); const next=form.id?contracts.map(c=>c.id===form.id?{...form,id}:c):[{...form,id},...contracts]; save(next); setForm({id:"",partner:"",territory:"",rate:""}); }}>{form.id?"Update":"Add"} Contract</Button>
  </Card>
  {contracts.map(c=><Card key={c.id} className="p-4 flex justify-between"><div><div className="font-medium">{c.partner}</div><div className="text-sm text-muted-foreground">{c.territory} · {c.rate}</div></div><div className="space-x-2"><Button variant="outline" onClick={()=>setForm(c)}>Edit</Button><Button variant="destructive" onClick={()=>save(contracts.filter(x=>x.id!==c.id))}>Delete</Button></div></Card>)}
  </div></DashboardLayout>;
}
