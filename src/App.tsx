import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import PropertiesPage from "./pages/PropertiesPage";
import ListingsPage from "./pages/ListingsPage";
import TransactionsPage from "./pages/TransactionsPage";
import AgentsPage from "./pages/AgentsPage";
import BuyersPage from "./pages/BuyersPage";
import OwnersPage from "./pages/OwnersPage";
import InspectionsPage from "./pages/InspectionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/buyers" element={<BuyersPage />} />
            <Route path="/owners" element={<OwnersPage />} />
            <Route path="/inspections" element={<InspectionsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
