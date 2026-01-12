import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Simulations from "./pages/Simulations";
import NewSimulation from "./pages/NewSimulation";
import StartSimulation from "./pages/StartSimulation";
import Calls from "./pages/Calls";
import CallDetail from "./pages/CallDetail";
import Buyers from "./pages/Buyers";
import Analytics from "./pages/Analytics";
import Assignments from "./pages/Assignments";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/simulations" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/simulations/new" element={<NewSimulation />} />
            <Route path="/simulations/:id/start" element={<StartSimulation />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/calls/:id" element={<CallDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/members" element={<Members />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
