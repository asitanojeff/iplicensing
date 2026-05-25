import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { readDemoStore, writeDemoStore } from "@/lib/demoData";
import { useState } from "react";

export default function Page() {
  const [store, setStore] = useState(() => readDemoStore());
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");

  const save = (next: typeof store) => { setStore(next); writeDemoStore(next); };

  return <DashboardLayout><div className="space-y-6"><h1 className="text-3xl font-bold">Product Approval</h1>
    <Card className="p-4 grid md:grid-cols-3 gap-2">
      <Input placeholder="Product name" value={productName} onChange={(e)=>setProductName(e.target.value)} />
      <Input placeholder="SKU" value={sku} onChange={(e)=>setSku(e.target.value)} />
      <Button onClick={()=>{ if(!productName || !sku) return; const contractId = store.contracts[0]?.id ?? "ct-1"; save({...store, submissions: [{id: crypto.randomUUID(), contractId, productName, sku, status: "Pending"}, ...store.submissions]}); setProductName(""); setSku(""); }}>Submit Product</Button>
    </Card>
    {store.submissions.map(i => <Card key={i.id} className="p-4 flex items-center justify-between"><div><div className="font-medium">{i.productName} ({i.sku})</div><div className="text-sm text-muted-foreground">Status: {i.status}</div></div><div className="space-x-2"><Button onClick={() => save({ ...store, submissions: store.submissions.map(x => x.id === i.id ? { ...x, status: "Approved" } : x) })}>Approve</Button><Button variant="destructive" onClick={() => save({ ...store, submissions: store.submissions.map(x => x.id === i.id ? { ...x, status: "Rejected" } : x) })}>Reject</Button></div></Card>)}
  </div></DashboardLayout>;
}
