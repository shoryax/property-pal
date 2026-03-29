import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Agent } from "@/types";
import { toast } from "sonner";
import { agentsApi, listingsApi, transactionsApi } from "@/lib/supabaseClient";

export default function AgentsPage() {
  const [agentsData, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [agents, listingsData, transactionsData] = await Promise.all([
        agentsApi.getAll(),
        listingsApi.getAll(),
        transactionsApi.getAll()
      ]);
      setAgents(agents);
      setListings(listingsData);
      setTransactions(transactionsData);
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
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      license_number: fd.get("license_number") as string,
      agency_name: fd.get("agency_name") as string,
      commission_rate: Number(fd.get("commission_rate")),
      joined_date: fd.get("joined_date") as string || new Date().toISOString().split("T")[0],
    };
    try {
      if (editing) {
        await agentsApi.update(editing.agent_id, data);
        toast.success("Agent updated");
      } else {
        await agentsApi.create(data);
        toast.success("Agent added");
      }
      setEditing(null);
      setOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving agent:", error);
      toast.error("Failed to save agent");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await agentsApi.delete(id);
      toast.success("Agent deleted");
      loadData();
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Failed to delete agent");
    }
  };

  const getActiveListings = (id: string) => listings.filter(l => l.agent_id === id && l.status === 'active').length;
  const getTotalSales = (id: string) => transactions.filter(t => t.agent_id === id && t.status === 'completed').length;

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "agency_name", label: "Agency" },
    { key: "commission_rate", label: "Commission", render: (a: Agent) => `${a.commission_rate}%` },
    { key: "active_listings", label: "Active Listings", render: (a: Agent) => getActiveListings(a.agent_id), sortable: false },
    { key: "total_sales", label: "Total Sales", render: (a: Agent) => getTotalSales(a.agent_id), sortable: false },
  ];

  if (loading) {
    return <div className="page-container"><p className="text-muted-foreground">Loading agents...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Agents</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Agent</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Agent" : "Add Agent"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Label>Name</Label><Input name="name" defaultValue={editing?.name} required /></div>
                <div><Label>Email</Label><Input name="email" type="email" defaultValue={editing?.email} required /></div>
                <div><Label>Phone</Label><Input name="phone" defaultValue={editing?.phone} required /></div>
                <div><Label>License Number</Label><Input name="license_number" defaultValue={editing?.license_number} required /></div>
                <div><Label>Agency Name</Label><Input name="agency_name" defaultValue={editing?.agency_name} required /></div>
                <div><Label>Commission Rate (%)</Label><Input name="commission_rate" type="number" step="0.1" defaultValue={editing?.commission_rate} required /></div>
                <div><Label>Joined Date</Label><Input name="joined_date" type="date" defaultValue={editing?.joined_date} /></div>
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Agent</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        data={agentsData}
        columns={columns}
        searchPlaceholder="Search agents..."
        actions={(a: Agent) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(a.agent_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )}
      />
    </div>
  );
}
