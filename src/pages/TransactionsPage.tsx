import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { transactions as initialTransactions, listings, agents, buyers, formatCurrency, getListingById, getPropertyById, getAgentById, getBuyerById } from "@/data/mockData";
import { Transaction } from "@/types";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [txns, setTxns] = useState<Transaction[]>(initialTransactions);
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = txns.filter(t => !filterStatus || t.status === filterStatus);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Transaction = {
      transaction_id: `t${Date.now()}`,
      listing_id: fd.get("listing_id") as string,
      buyer_id: fd.get("buyer_id") as string,
      agent_id: fd.get("agent_id") as string,
      sale_price: Number(fd.get("sale_price")),
      transaction_date: fd.get("transaction_date") as string,
      payment_mode: fd.get("payment_mode") as string,
      status: fd.get("status") as Transaction["status"],
    };
    setTxns(prev => [...prev, data]);
    toast.success("Transaction recorded");
    setOpen(false);
  };

  const columns = [
    { key: "listing_id", label: "Property", render: (t: Transaction) => { const l = getListingById(t.listing_id); return l ? getPropertyById(l.property_id)?.title || 'N/A' : t.listing_id; }},
    { key: "buyer_id", label: "Buyer", render: (t: Transaction) => getBuyerById(t.buyer_id)?.name || t.buyer_id },
    { key: "agent_id", label: "Agent", render: (t: Transaction) => getAgentById(t.agent_id)?.name || t.agent_id },
    { key: "sale_price", label: "Amount", render: (t: Transaction) => formatCurrency(t.sale_price) },
    { key: "transaction_date", label: "Date" },
    { key: "payment_mode", label: "Payment Mode" },
    { key: "status", label: "Status", render: (t: Transaction) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Record Transaction</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New Transaction</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div><Label>Listing</Label>
                <Select name="listing_id">
                  <SelectTrigger><SelectValue placeholder="Select listing" /></SelectTrigger>
                  <SelectContent>{listings.map(l => <SelectItem key={l.listing_id} value={l.listing_id}>{getPropertyById(l.property_id)?.title || l.listing_id}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Buyer</Label>
                <Select name="buyer_id">
                  <SelectTrigger><SelectValue placeholder="Select buyer" /></SelectTrigger>
                  <SelectContent>{buyers.map(b => <SelectItem key={b.buyer_id} value={b.buyer_id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Agent</Label>
                <Select name="agent_id">
                  <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
                  <SelectContent>{agents.map(a => <SelectItem key={a.agent_id} value={a.agent_id}>{a.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Sale Price (₹)</Label><Input name="sale_price" type="number" required /></div>
                <div><Label>Date</Label><Input name="transaction_date" type="date" required /></div>
                <div><Label>Payment Mode</Label><Input name="payment_mode" required placeholder="Bank Transfer, Cash, etc." /></div>
                <div><Label>Status</Label>
                  <Select name="status" defaultValue="pending">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Record Transaction</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {filterStatus && <Button variant="ghost" onClick={() => setFilterStatus("")}>Clear</Button>}
      </div>

      <DataTable data={filtered} columns={columns} searchKey="transaction_id" searchPlaceholder="Search transactions..." />
    </div>
  );
}
