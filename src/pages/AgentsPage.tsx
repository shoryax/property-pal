import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { agents as initialAgents, listings, transactions } from "@/data/mockData";
import { Agent } from "@/types";
import { toast } from "sonner";

export default function AgentsPage() {
  const [agentsData, setAgents] = useState<Agent[]>(initialAgents);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Agent = {
      agent_id: editing?.agent_id || `a${Date.now()}`,
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      license_number: fd.get("license_number") as string,
      agency_name: fd.get("agency_name") as string,
      commission_rate: Number(fd.get("commission_rate")),
      joined_date: fd.get("joined_date") as string || new Date().toISOString().split("T")[0],
    };
    if (editing) {
      setAgents(prev => prev.map(a => a.agent_id === editing.agent_id ? data : a));
      toast.success("Agent updated");
    } else {
      setAgents(prev => [...prev, data]);
      toast.success("Agent added");
    }
    setEditing(null);
    setOpen(false);
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
      <DataTable data={agentsData} columns={columns} searchPlaceholder="Search agents..." actions={(a: Agent) => (
        <Button variant="ghost" size="sm" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
      )} />
    </div>
  );
}
