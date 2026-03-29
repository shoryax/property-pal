import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Property } from "@/types";
import { toast } from "sonner";
import { propertiesApi, ownersApi } from "@/lib/supabaseClient";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [filterCity, setFilterCity] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propertiesData, ownersData] = await Promise.all([
        propertiesApi.getAll(),
        ownersApi.getAll()
      ]);
      setProperties(propertiesData);
      setOwners(ownersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const cities = [...new Set(properties.map(p => p.city))];

  const filtered = properties.filter(p => {
    if (filterCity && filterCity !== "all" && p.city !== filterCity) return false;
    if (filterType && filterType !== "all" && p.type !== filterType) return false;
    if (filterStatus && filterStatus !== "all" && p.status !== filterStatus) return false;
    return true;
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      owner_id: fd.get("owner_id") as string,
      title: fd.get("title") as string,
      type: fd.get("type") as Property["type"],
      address: fd.get("address") as string,
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      pincode: fd.get("pincode") as string,
      area_sqft: Number(fd.get("area_sqft")),
      price: Number(fd.get("price")),
      status: fd.get("status") as Property["status"],
      description: fd.get("description") as string,
      listed_date: fd.get("listed_date") as string || new Date().toISOString().split("T")[0],
    };
    try {
      if (editing) {
        await propertiesApi.update(editing.property_id, data);
        toast.success("Property updated successfully");
      } else {
        await propertiesApi.create(data);
        toast.success("Property added successfully");
      }
      setEditing(null);
      setOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error("Failed to save property");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await propertiesApi.delete(id);
      toast.success("Property deleted");
      loadData();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "type", label: "Type", render: (p: Property) => <span className="capitalize">{p.type}</span> },
    { key: "city", label: "City" },
    { key: "area_sqft", label: "Area (sqft)", render: (p: Property) => p.area_sqft?.toLocaleString() },
    { key: "price", label: "Price", render: (p: Property) => formatCurrency(p.price) },
    { key: "status", label: "Status", render: (p: Property) => <StatusBadge status={p.status} /> },
  ];

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  if (loading) {
    return <div className="page-container"><p className="text-muted-foreground">Loading properties...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Properties</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Property</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Property" : "Add Property"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div><Label>Owner</Label>
                <Select name="owner_id" defaultValue={editing?.owner_id}>
                  <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                  <SelectContent>
                    {owners.map(o => <SelectItem key={o.owner_id} value={o.owner_id}>{o.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Title</Label>
                  <Input name="title" defaultValue={editing?.title} required />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select name="type" defaultValue={editing?.type || "apartment"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select name="status" defaultValue={editing?.status || "available"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input name="address" defaultValue={editing?.address} required />
                </div>
                <div><Label>City</Label><Input name="city" defaultValue={editing?.city} required /></div>
                <div><Label>State</Label><Input name="state" defaultValue={editing?.state} required /></div>
                <div><Label>Pincode</Label><Input name="pincode" defaultValue={editing?.pincode} required /></div>
                <div><Label>Area (sqft)</Label><Input name="area_sqft" type="number" defaultValue={editing?.area_sqft} required /></div>
                <div><Label>Price (₹)</Label><Input name="price" type="number" defaultValue={editing?.price} required /></div>
                <div><Label>Listed Date</Label><Input name="listed_date" type="date" defaultValue={editing?.listed_date} /></div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea name="description" defaultValue={editing?.description} />
                </div>
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Property</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Cities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
          </SelectContent>
        </Select>
        {(filterCity || filterType || filterStatus) && (
          <Button variant="ghost" onClick={() => { setFilterCity(""); setFilterType(""); setFilterStatus(""); }}>
            Clear Filters
          </Button>
        )}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search properties..."
        actions={(p: Property) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => { setEditing(p); setOpen(true); }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(p.property_id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
