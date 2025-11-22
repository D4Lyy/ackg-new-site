import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import LanguageCourses from "./pages/LanguageCourses";
import About from "./pages/About";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            {/* Redirect root to French */}
            <Route path="/" element={<Navigate to="/fr/accueil" replace />} />
            
            {/* French routes */}
            <Route path="/fr/accueil" element={<Home />} />
            <Route path="/fr/activites" element={<Activities />} />
            <Route path="/fr/activite/:slug" element={<ActivityDetail />} />
            <Route path="/fr/cours-de-langues" element={<LanguageCourses />} />
            <Route path="/fr/a-propos" element={<About />} />
            
            {/* Kurdish routes */}
            <Route path="/ku/accueil" element={<Home />} />
            <Route path="/ku/activites" element={<Activities />} />
            <Route path="/ku/activite/:slug" element={<ActivityDetail />} />
            <Route path="/ku/cours-de-langues" element={<LanguageCourses />} />
            <Route path="/ku/a-propos" element={<About />} />
            
            {/* Admin (no language prefix) */}
            <Route path="/admin" element={<Admin />} />
            
            {/* Legacy routes redirect to French */}
            <Route path="/activites" element={<Navigate to="/fr/activites" replace />} />
            <Route path="/activite/:slug" element={<Navigate to="/fr/activite/:slug" replace />} />
            <Route path="/cours-de-langues" element={<Navigate to="/fr/cours-de-langues" replace />} />
            <Route path="/a-propos" element={<Navigate to="/fr/a-propos" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
