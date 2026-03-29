import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Owner } from "@/types";
import { toast } from "sonner";
import { ownersApi } from "@/lib/supabaseClient";

export default function OwnersPage() {
  const [ownersData, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Owner | null>(null);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const data = await ownersApi.getAll();
      setOwners(data);
    } catch (error) {
      console.error("Error loading owners:", error);
      toast.error("Failed to load owners");
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
      address: fd.get("address") as string,
      id_proof_type: fd.get("id_proof_type") as string,
      id_proof_number: fd.get("id_proof_number") as string,
    };
    try {
      if (editing) {
        await ownersApi.update(editing.owner_id, data);
        toast.success("Owner updated");
      } else {
        await ownersApi.create(data);
        toast.success("Owner added");
      }
      setEditing(null);
      setOpen(false);
      loadOwners();
    } catch (error) {
      console.error("Error saving owner:", error);
      toast.error("Failed to save owner");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ownersApi.delete(id);
      toast.success("Owner deleted");
      loadOwners();
    } catch (error) {
      console.error("Error deleting owner:", error);
      toast.error("Failed to delete owner");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "id_proof_type", label: "ID Proof" },
  ];

  if (loading) {
    return <div className="page-container"><p className="text-muted-foreground">Loading owners...</p></div>;
  }

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
      <DataTable
        data={ownersData}
        columns={columns}
        searchPlaceholder="Search owners..."
        actions={(o: Owner) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => { setEditing(o); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(o.owner_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )}
      />
    </div>
  );
}
