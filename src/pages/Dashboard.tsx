import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ClipboardList, ArrowRightLeft, UserCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { propertiesApi, listingsApi, transactionsApi, agentsApi } from "@/lib/supabaseClient";
import { toast } from "sonner";

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(280, 67%, 52%)'];

export default function Dashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propertiesData, listingsData, transactionsData, agentsData] = await Promise.all([
        propertiesApi.getAll(),
        listingsApi.getAll(),
        transactionsApi.getAll(),
        agentsApi.getAll()
      ]);
      setProperties(propertiesData);
      setListings(listingsData);
      setTransactions(transactionsData);
      setAgents(agentsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Properties", value: properties.length, icon: Building2, color: "text-primary" },
    { label: "Active Listings", value: listings.filter(l => l.status === 'active').length, icon: ClipboardList, color: "text-success" },
    { label: "Completed Transactions", value: transactions.filter(t => t.status === 'completed').length, icon: ArrowRightLeft, color: "text-warning" },
    { label: "Registered Agents", value: agents.length, icon: UserCheck, color: "text-chart-4" },
  ];

  const typeData = [
    { name: 'Apartment', value: properties.filter(p => p.type === 'apartment').length },
    { name: 'Villa', value: properties.filter(p => p.type === 'villa').length },
    { name: 'Plot', value: properties.filter(p => p.type === 'plot').length },
    { name: 'Commercial', value: properties.filter(p => p.type === 'commercial').length },
  ];

  const monthlyData = [
    { month: 'Jan', sales: transactions.filter(t => t.transaction_date?.startsWith('2024-01')).length },
    { month: 'Feb', sales: transactions.filter(t => t.transaction_date?.startsWith('2024-02')).length },
    { month: 'Mar', sales: transactions.filter(t => t.transaction_date?.startsWith('2024-03')).length },
    { month: 'Apr', sales: transactions.filter(t => t.transaction_date?.startsWith('2024-04')).length },
    { month: 'May', sales: transactions.filter(t => t.transaction_date?.startsWith('2024-05')).length },
    { month: 'Jun', sales: transactions.filter(t => t.transaction_date?.startsWith('2024-06')).length },
  ];

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  if (loading) {
    return <div className="page-container"><p className="text-muted-foreground">Loading dashboard...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="stat-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon className={`h-10 w-10 ${s.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Properties by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 10).map((t) => {
                const property = t.listing?.property;
                const buyer = t.buyer;
                const agent = t.agent;
                return (
                  <TableRow key={t.transaction_id}>
                    <TableCell className="font-medium">{property?.title || 'N/A'}</TableCell>
                    <TableCell>{buyer?.name || 'N/A'}</TableCell>
                    <TableCell>{agent?.name || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(t.sale_price)}</TableCell>
                    <TableCell>{t.transaction_date || 'N/A'}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
