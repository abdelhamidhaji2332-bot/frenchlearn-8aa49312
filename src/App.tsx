import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Levels from "./pages/Levels";
import Grammar from "./pages/Grammar";
import Vocabulary from "./pages/Vocabulary";
import Speaking from "./pages/Speaking";
import Dictionary from "./pages/Dictionary";
import Conjugator from "./pages/Conjugator";
import Media from "./pages/Media";
import Stories from "./pages/Stories";
import Settings from "./pages/Settings";
import Flashcards from "./pages/Flashcards";
import Games from "./pages/Games";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/conjugator" element={<Conjugator />} />
            <Route path="/media" element={<Media />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/games" element={<Games />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
