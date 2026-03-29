import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Transaction } from "@/types";
import { toast } from "sonner";
import { transactionsApi, listingsApi, buyersApi, agentsApi } from "@/lib/supabaseClient";

export default function TransactionsPage() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactions, listingsData, buyersData, agentsData] = await Promise.all([
        transactionsApi.getAll(),
        listingsApi.getAll(),
        buyersApi.getAll(),
        agentsApi.getAll()
      ]);
      setTxns(transactions);
      setListings(listingsData);
      setBuyers(buyersData);
      setAgents(agentsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filtered = txns.filter(t => !filterStatus || filterStatus === "all" || t.status === filterStatus);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      listing_id: fd.get("listing_id") as string,
      buyer_id: fd.get("buyer_id") as string,
      agent_id: fd.get("agent_id") as string,
      sale_price: Number(fd.get("sale_price")),
      transaction_date: fd.get("transaction_date") as string,
      payment_mode: fd.get("payment_mode") as string,
      status: fd.get("status") as Transaction["status"],
    };
    try {
      await transactionsApi.create(data);
      toast.success("Transaction recorded");
      setOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Failed to record transaction");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionsApi.delete(id);
      toast.success("Transaction deleted");
      loadData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  const columns = [
    { key: "listing_id", label: "Property", render: (t: Transaction) => {
      const prop = t.listing?.property;
      return prop?.title || t.listing_id;
    }},
    { key: "buyer_id", label: "Buyer", render: (t: Transaction) => t.buyer?.name || t.buyer_id },
    { key: "agent_id", label: "Agent", render: (t: Transaction) => t.agent?.name || t.agent_id },
    { key: "sale_price", label: "Amount", render: (t: Transaction) => formatCurrency(t.sale_price) },
    { key: "transaction_date", label: "Date" },
    { key: "payment_mode", label: "Payment Mode" },
    { key: "status", label: "Status", render: (t: Transaction) => <StatusBadge status={t.status} /> },
  ];

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  if (loading) {
    return <div className="page-container"><p className="text-muted-foreground">Loading transactions...</p></div>;
  }

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
                  <SelectContent>{listings.map(l => <SelectItem key={l.listing_id} value={l.listing_id}>{l.property?.title || l.listing_id}</SelectItem>)}</SelectContent>
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

      <DataTable
        data={filtered}
        columns={columns}
        searchKey="transaction_id"
        searchPlaceholder="Search transactions..."
        actions={(t: Transaction) => (
          <Button variant="ghost" size="sm" onClick={() => handleDelete(t.transaction_id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      />
    </div>
  );
}
