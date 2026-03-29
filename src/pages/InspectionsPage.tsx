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
import { Inspection } from "@/types";
import { toast } from "sonner";
import { inspectionsApi, propertiesApi, buyersApi } from "@/lib/supabaseClient";

export default function InspectionsPage() {
  const [inspectionsData, setInspections] = useState<Inspection[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Inspection | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inspections, propertiesData, buyersData] = await Promise.all([
        inspectionsApi.getAll(),
        propertiesApi.getAll(),
        buyersApi.getAll()
      ]);
      setInspections(inspections);
      setProperties(propertiesData);
      setBuyers(buyersData);
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
      buyer_id: fd.get("buyer_id") as string,
      scheduled_date: fd.get("scheduled_date") as string,
      status: fd.get("status") as Inspection["status"],
      notes: fd.get("notes") as string,
    };
    try {
      if (editing) {
        await inspectionsApi.update(editing.inspection_id, data);
        toast.success("Inspection updated");
      } else {
        await inspectionsApi.create(data);
        toast.success("Inspection scheduled");
      }
      setEditing(null);
      setOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving inspection:", error);
      toast.error("Failed to save inspection");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await inspectionsApi.delete(id);
      toast.success("Inspection deleted");
      loadData();
    } catch (error) {
      console.error("Error deleting inspection:", error);
      toast.error("Failed to delete inspection");
    }
  };

  const columns = [
    { key: "property_id", label: "Property", render: (i: Inspection) => i.property?.title || i.property_id },
    { key: "buyer_id", label: "Buyer", render: (i: Inspection) => i.buyer?.name || i.buyer_id },
    { key: "scheduled_date", label: "Scheduled Date" },
    { key: "status", label: "Status", render: (i: Inspection) => <StatusBadge status={i.status} /> },
    { key: "notes", label: "Notes" },
  ];

  if (loading) {
    return <div className="page-container"><p className="text-muted-foreground">Loading inspections...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Inspections</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Schedule Inspection</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Inspection" : "Schedule Inspection"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div><Label>Property</Label>
                <Select name="property_id" defaultValue={editing?.property_id}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>{properties.map(p => <SelectItem key={p.property_id} value={p.property_id}>{p.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Buyer</Label>
                <Select name="buyer_id" defaultValue={editing?.buyer_id}>
                  <SelectTrigger><SelectValue placeholder="Select buyer" /></SelectTrigger>
                  <SelectContent>{buyers.map(b => <SelectItem key={b.buyer_id} value={b.buyer_id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Scheduled Date</Label><Input name="scheduled_date" type="date" defaultValue={editing?.scheduled_date} required /></div>
                <div><Label>Status</Label>
                  <Select name="status" defaultValue={editing?.status || "scheduled"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Notes</Label><Textarea name="notes" defaultValue={editing?.notes} /></div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Schedule"} Inspection</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        data={inspectionsData}
        columns={columns}
        searchKey="inspection_id"
        searchPlaceholder="Search inspections..."
        actions={(i: Inspection) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => { setEditing(i); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(i.inspection_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )}
      />
    </div>
  );
}
