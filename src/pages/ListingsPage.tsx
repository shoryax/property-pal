import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";
import { listings as initialListings, properties, agents, owners, formatCurrency, getPropertyById, getAgentById, getOwnerById } from "@/data/mockData";
import { Listing } from "@/types";
import { toast } from "sonner";

export default function ListingsPage() {
  const [listingsData, setListings] = useState<Listing[]>(initialListings);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Listing | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Listing = {
      listing_id: editing?.listing_id || `l${Date.now()}`,
      property_id: fd.get("property_id") as string,
      agent_id: fd.get("agent_id") as string,
      owner_id: fd.get("owner_id") as string,
      listing_type: fd.get("listing_type") as 'sale' | 'rent',
      asking_price: Number(fd.get("asking_price")),
      listing_date: fd.get("listing_date") as string,
      expiry_date: fd.get("expiry_date") as string,
      status: fd.get("status") as string,
    };
    if (editing) {
      setListings(prev => prev.map(l => l.listing_id === editing.listing_id ? data : l));
      toast.success("Listing updated");
    } else {
      setListings(prev => [...prev, data]);
      toast.success("Listing created");
    }
    setEditing(null);
    setOpen(false);
  };

  const columns = [
    { key: "property_id", label: "Property", render: (l: Listing) => getPropertyById(l.property_id)?.title || l.property_id },
    { key: "agent_id", label: "Agent", render: (l: Listing) => getAgentById(l.agent_id)?.name || l.agent_id },
    { key: "owner_id", label: "Owner", render: (l: Listing) => getOwnerById(l.owner_id)?.name || l.owner_id },
    { key: "listing_type", label: "Type", render: (l: Listing) => <span className="capitalize">{l.listing_type}</span> },
    { key: "asking_price", label: "Asking Price", render: (l: Listing) => formatCurrency(l.asking_price) },
    { key: "listing_date", label: "Listed" },
    { key: "status", label: "Status", render: (l: Listing) => <StatusBadge status={l.status} /> },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Listings</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Listing</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Listing" : "Create Listing"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div><Label>Property</Label>
                <Select name="property_id" defaultValue={editing?.property_id}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>{properties.map(p => <SelectItem key={p.property_id} value={p.property_id}>{p.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Agent</Label>
                <Select name="agent_id" defaultValue={editing?.agent_id}>
                  <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
                  <SelectContent>{agents.map(a => <SelectItem key={a.agent_id} value={a.agent_id}>{a.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Owner</Label>
                <Select name="owner_id" defaultValue={editing?.owner_id}>
                  <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                  <SelectContent>{owners.map(o => <SelectItem key={o.owner_id} value={o.owner_id}>{o.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Listing Type</Label>
                  <Select name="listing_type" defaultValue={editing?.listing_type || "sale"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Status</Label>
                  <Select name="status" defaultValue={editing?.status || "active"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Asking Price (₹)</Label><Input name="asking_price" type="number" defaultValue={editing?.asking_price} required /></div>
                <div><Label>Listing Date</Label><Input name="listing_date" type="date" defaultValue={editing?.listing_date} required /></div>
                <div><Label>Expiry Date</Label><Input name="expiry_date" type="date" defaultValue={editing?.expiry_date} required /></div>
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Create"} Listing</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={listingsData}
        columns={columns}
        searchKey="listing_id"
        searchPlaceholder="Search listings..."
        actions={(l: Listing) => (
          <Button variant="ghost" size="sm" onClick={() => { setEditing(l); setOpen(true); }}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      />
    </div>
  );
}
