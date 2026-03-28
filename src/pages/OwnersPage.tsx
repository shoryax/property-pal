import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { owners as initialOwners, properties } from "@/data/mockData";
import { Owner } from "@/types";
import { toast } from "sonner";

export default function OwnersPage() {
  const [ownersData, setOwners] = useState<Owner[]>(initialOwners);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Owner | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Owner = {
      owner_id: editing?.owner_id || `o${Date.now()}`,
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      address: fd.get("address") as string,
      id_proof_type: fd.get("id_proof_type") as string,
      id_proof_number: fd.get("id_proof_number") as string,
    };
    if (editing) {
      setOwners(prev => prev.map(o => o.owner_id === editing.owner_id ? data : o));
      toast.success("Owner updated");
    } else {
      setOwners(prev => [...prev, data]);
      toast.success("Owner added");
    }
    setEditing(null);
    setOpen(false);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "id_proof_type", label: "ID Proof" },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Owners</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Owner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Owner" : "Add Owner"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Label>Name</Label><Input name="name" defaultValue={editing?.name} required /></div>
                <div><Label>Email</Label><Input name="email" type="email" defaultValue={editing?.email} required /></div>
                <div><Label>Phone</Label><Input name="phone" defaultValue={editing?.phone} required /></div>
                <div className="col-span-2"><Label>Address</Label><Input name="address" defaultValue={editing?.address} required /></div>
                <div><Label>ID Proof Type</Label><Input name="id_proof_type" defaultValue={editing?.id_proof_type} placeholder="Aadhaar, PAN, etc." required /></div>
                <div><Label>ID Proof Number</Label><Input name="id_proof_number" defaultValue={editing?.id_proof_number} required /></div>
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Owner</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={ownersData} columns={columns} searchPlaceholder="Search owners..." actions={(o: Owner) => (
        <Button variant="ghost" size="sm" onClick={() => { setEditing(o); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
      )} />
    </div>
  );
}
