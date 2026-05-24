import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";

type AssetType = "logo" | "artwork" | "template" | "style_guide" | "other";

export default function Page() {
  const utils = trpc.useUtils();
  const { data: assets = [], isLoading } = trpc.assets.list.useQuery();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [assetType, setAssetType] = useState<AssetType>("artwork");
  const [file, setFile] = useState<File | null>(null);

  const createAsset = trpc.assets.create.useMutation();
  const uploadFile = trpc.assets.uploadFile.useMutation();

  const canSubmit = useMemo(() => Boolean(name && category && file), [name, category, file]);

  const onSubmit = async () => {
    if (!canSubmit || !file) return;

    const created = await createAsset.mutateAsync({ name, category, description, assetType });
    const buffer = await file.arrayBuffer();
    const binary = new Uint8Array(buffer);
    let chunk = "";
    binary.forEach((b) => (chunk += String.fromCharCode(b)));
    const base64 = btoa(chunk);

    await uploadFile.mutateAsync({
      assetId: created.id,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      base64,
      fileSize: file.size,
    });

    await utils.assets.list.invalidate();
    setName("");
    setCategory("");
    setDescription("");
    setFile(null);
  };

  return <DashboardLayout><div className="space-y-6"><div><h1 className="text-3xl font-bold">IP Assets</h1></div>
    <Card className="p-4 grid md:grid-cols-5 gap-2">
      <Input placeholder="Asset name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <select className="w-full border rounded-md h-10 px-3" value={assetType} onChange={(e) => setAssetType(e.target.value as AssetType)}>
        <option value="artwork">Artwork</option><option value="logo">Logo</option><option value="template">Template</option><option value="style_guide">Style Guide</option><option value="other">Other</option>
      </select>
      <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button className="md:col-span-5" onClick={onSubmit} disabled={!canSubmit || createAsset.isPending || uploadFile.isPending}>Upload Asset</Button>
    </Card>
    <div className="space-y-2">{isLoading ? <Card className="p-4">Loading...</Card> : assets.map((a) => <Card key={a.id} className="p-4"><div className="font-medium">{a.name}</div><div className="text-sm text-muted-foreground">{a.category} · {a.assetType}</div></Card>)}</div>
  </div></DashboardLayout>;
}
