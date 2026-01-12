import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import AIRoleplays from "./pages/AIRoleplays";
import NewRoleplay from "./pages/NewRoleplay";
import StartRoleplay from "./pages/StartRoleplay";
import CallsPage from "./pages/CallsPage";
import CallDetailPage from "./pages/CallDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
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
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/roleplays" element={<AIRoleplays />} />
            <Route path="/roleplays/new" element={<NewRoleplay />} />
            <Route path="/roleplays/:id/start" element={<StartRoleplay />} />
            <Route path="/calls" element={<CallsPage />} />
            <Route path="/calls/:id" element={<CallDetailPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/training" element={<Assignments />} />
            <Route path="/team" element={<Members />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
