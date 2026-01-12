import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import LanguageCourses from "./pages/LanguageCourses";
import About from "./pages/About";
import Admin from "./pages/Admin";
import LegalNotice from "./pages/LegalNotice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Routes>
                {/* French routes */}
                <Route path="/fr/home" element={<Home />} />
                <Route path="/fr/activities" element={<Activities />} />
                <Route path="/fr/activity/:slug" element={<ActivityDetail />} />
                <Route path="/fr/language-courses" element={<LanguageCourses />} />
                <Route path="/fr/about" element={<About />} />
                <Route path="/fr/legal-notice" element={<LegalNotice />} />
                <Route path="/fr/admin" element={<Admin />} />
                
                {/* Kurdish routes */}
                <Route path="/ku/home" element={<Home />} />
                <Route path="/ku/activities" element={<Activities />} />
                <Route path="/ku/activity/:slug" element={<ActivityDetail />} />
                <Route path="/ku/language-courses" element={<LanguageCourses />} />
                <Route path="/ku/about" element={<About />} />
                <Route path="/ku/legal-notice" element={<LegalNotice />} />
                <Route path="/ku/admin" element={<Admin />} />
                
                {/* Admin route (no language prefix) */}
                <Route path="/admin" element={<Admin />} />
                
                {/* Root redirect to French home */}
                <Route path="/" element={<Navigate to="/fr/home" replace />} />

                {/* Language root redirects */}
                <Route path="/fr" element={<Navigate to="/fr/home" replace />} />
                <Route path="/ku" element={<Navigate to="/ku/home" replace />} />
                
                {/* Legacy redirects */}
                <Route path="/activites" element={<Navigate to="/fr/activities" replace />} />
                <Route path="/activite/:slug" element={<Navigate to="/fr/activity/:slug" replace />} />
                <Route path="/cours-de-langues" element={<Navigate to="/fr/language-courses" replace />} />
                <Route path="/a-propos" element={<Navigate to="/fr/about" replace />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
