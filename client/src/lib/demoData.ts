export type DemoIp = {
  id: string;
  title: string;
  category: string;
  description: string;
};

export type DemoLicensee = {
  id: string;
  name: string;
  territory: string;
  email: string;
};

export type DemoContract = {
  id: string;
  ipId: string;
  licenseeId: string;
  territory: string;
  royaltyRate: string;
  startDate: string;
  endDate: string;
};

export type DemoSubmission = {
  id: string;
  contractId: string;
  productName: string;
  sku: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type DemoStore = {
  ipAssets: DemoIp[];
  licensees: DemoLicensee[];
  contracts: DemoContract[];
  submissions: DemoSubmission[];
};

const KEY = "iplicensing-demo-store";

const seed: DemoStore = {
  ipAssets: [{ id: "ip-1", title: "Sheep Gadget", category: "Character", description: "Primary mascot character bundle" }],
  licensees: [{ id: "lic-1", name: "Acme Retail Co.", territory: "North America", email: "ops@acmeretail.example" }],
  contracts: [{ id: "ct-1", ipId: "ip-1", licenseeId: "lic-1", territory: "North America", royaltyRate: "12", startDate: "2026-01-01", endDate: "2027-12-31" }],
  submissions: [{ id: "sub-1", contractId: "ct-1", productName: "Sheep Gadget Premium Plush", sku: "SG-PLUSH-001", status: "Pending" }],
};

export function readDemoStore(): DemoStore {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return { ...seed, ...JSON.parse(raw) };
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
}

export function writeDemoStore(next: DemoStore) {
  localStorage.setItem(KEY, JSON.stringify(next));
}
