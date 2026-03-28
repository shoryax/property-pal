import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ClipboardList, ArrowRightLeft, UserCheck } from "lucide-react";
import { properties, listings, transactions, agents, formatCurrency, getAgentById, getBuyerById, getListingById, getPropertyById } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

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

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(280, 67%, 52%)'];

const monthlyData = [
  { month: 'Jan', sales: 1 },
  { month: 'Feb', sales: 0 },
  { month: 'Mar', sales: 2 },
  { month: 'Apr', sales: 1 },
  { month: 'May', sales: 1 },
  { month: 'Jun', sales: 0 },
];

export default function Dashboard() {
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
              {transactions.map((t) => {
                const listing = getListingById(t.listing_id);
                const property = listing ? getPropertyById(listing.property_id) : null;
                const buyer = getBuyerById(t.buyer_id);
                const agent = getAgentById(t.agent_id);
                return (
                  <TableRow key={t.transaction_id}>
                    <TableCell className="font-medium">{property?.title || 'N/A'}</TableCell>
                    <TableCell>{buyer?.name || 'N/A'}</TableCell>
                    <TableCell>{agent?.name || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(t.sale_price)}</TableCell>
                    <TableCell>{t.transaction_date}</TableCell>
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
