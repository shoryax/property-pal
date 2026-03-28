import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";
import { buyers as initialBuyers, formatCurrency } from "@/data/mockData";
import { Buyer } from "@/types";
import { toast } from "sonner";

export default function BuyersPage() {
  const [buyersData, setBuyers] = useState<Buyer[]>(initialBuyers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Buyer | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Buyer = {
      buyer_id: editing?.buyer_id || `b${Date.now()}`,
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      budget_min: Number(fd.get("budget_min")),
      budget_max: Number(fd.get("budget_max")),
      preferred_city: fd.get("preferred_city") as string,
      preferred_type: fd.get("preferred_type") as string,
    };
    if (editing) {
      setBuyers(prev => prev.map(b => b.buyer_id === editing.buyer_id ? data : b));
      toast.success("Buyer updated");
    } else {
      setBuyers(prev => [...prev, data]);
      toast.success("Buyer added");
    }
    setEditing(null);
    setOpen(false);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "budget_min", label: "Min Budget", render: (b: Buyer) => formatCurrency(b.budget_min) },
    { key: "budget_max", label: "Max Budget", render: (b: Buyer) => formatCurrency(b.budget_max) },
    { key: "preferred_city", label: "Preferred City" },
    { key: "preferred_type", label: "Preferred Type", render: (b: Buyer) => <span className="capitalize">{b.preferred_type}</span> },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Buyers</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Buyer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Buyer" : "Add Buyer"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Label>Name</Label><Input name="name" defaultValue={editing?.name} required /></div>
                <div><Label>Email</Label><Input name="email" type="email" defaultValue={editing?.email} required /></div>
                <div><Label>Phone</Label><Input name="phone" defaultValue={editing?.phone} required /></div>
                <div><Label>Min Budget (₹)</Label><Input name="budget_min" type="number" defaultValue={editing?.budget_min} required /></div>
                <div><Label>Max Budget (₹)</Label><Input name="budget_max" type="number" defaultValue={editing?.budget_max} required /></div>
                <div><Label>Preferred City</Label><Input name="preferred_city" defaultValue={editing?.preferred_city} /></div>
                <div><Label>Preferred Type</Label>
                  <Select name="preferred_type" defaultValue={editing?.preferred_type || "apartment"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Buyer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={buyersData} columns={columns} searchPlaceholder="Search buyers..." actions={(b: Buyer) => (
        <Button variant="ghost" size="sm" onClick={() => { setEditing(b); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
      )} />
    </div>
  );
}
