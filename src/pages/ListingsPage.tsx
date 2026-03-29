import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Listing } from "@/types";
import { toast } from "sonner";
import { listingsApi, propertiesApi, agentsApi, ownersApi } from "@/lib/supabaseClient";

export default function ListingsPage() {
  const [listingsData, setListings] = useState<Listing[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Listing | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [listings, propertiesData, agentsData, ownersData] = await Promise.all([
        listingsApi.getAll(),
        propertiesApi.getAll(),
        agentsApi.getAll(),
        ownersApi.getAll()
      ]);
      setListings(listings);
      setProperties(propertiesData);
      setAgents(agentsData);
      setOwners(ownersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      property_id: fd.get("property_id") as string,
      agent_id: fd.get("agent_id") as string,
      owner_id: fd.get("owner_id") as string,
      listing_type: fd.get("listing_type") as 'sale' | 'rent',
      asking_price: Number(fd.get("asking_price")),
      listing_date: fd.get("listing_date") as string,
      expiry_date: fd.get("expiry_date") as string,
      status: fd.get("status") as string,
    };
    try {
      if (editing) {
        await listingsApi.update(editing.listing_id, data);
        toast.success("Listing updated");
      } else {
        await listingsApi.create(data);
        toast.success("Listing created");
      }
      setEditing(null);
      setOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error("Failed to save listing");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await listingsApi.delete(id);
      toast.success("Listing deleted");
      loadData();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  const columns = [
    { key: "property_id", label: "Property", render: (l: Listing) => l.property?.title || l.property_id },
    { key: "agent_id", label: "Agent", render: (l: Listing) => l.agent?.name || l.agent_id },
    { key: "owner_id", label: "Owner", render: (l: Listing) => l.owner?.name || l.owner_id },
    { key: "listing_type", label: "Type", render: (l: Listing) => <span className="capitalize">{l.listing_type}</span> },
    { key: "asking_price", label: "Asking Price", render: (l: Listing) => formatCurrency(l.asking_price) },
    { key: "listing_date", label: "Listed" },
    { key: "status", label: "Status", render: (l: Listing) => <StatusBadge status={l.status} /> },
  ];

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  if (loading) {
    return <div className="page-container"><p className="text-muted-foreground">Loading listings...</p></div>;
  }

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
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => { setEditing(l); setOpen(true); }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(l.listing_id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
