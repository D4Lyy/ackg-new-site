import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen) {
        const target = e.target as HTMLElement;
        const nav = document.querySelector('nav');
        if (nav && !nav.contains(target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Extract current language from URL
  useEffect(() => {
    const pathLang = location.pathname.split('/')[1];
    if (pathLang === 'fr' || pathLang === 'ku') {
      if (pathLang !== language) {
        setLanguage(pathLang as 'fr' | 'ku');
      }
    }
  }, [location.pathname]);

  const links = [
    { href: `/${language}/home`, label: t("nav.home") },
    { href: `/${language}/activities`, label: t("nav.activities") },
    { href: `/${language}/language-courses`, label: t("nav.courses") },
    { href: `/${language}/about`, label: t("nav.about") },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const handleLanguageChange = (newLang: 'fr' | 'ku') => {
    // Get current path without language prefix
    const pathParts = location.pathname.split('/');
    const currentPath = pathParts.slice(2).join('/') || 'home';
    
    // Navigate to new language path
    navigate(`/${newLang}/${currentPath}`);
    setLanguage(newLang);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={`/${language}/home`} className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ACKG Logo"
              className="h-20 w-20 object-contain"
            />
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-foreground">{t("nav.name.top")}</div>
              <div className="text-xs text-muted-foreground">{t("nav.name.bottom")}</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={isActive(link.href) ? "default" : "ghost"}
                  className="font-medium"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("ku")}>
                  Kurdî
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(link.href) ? "default" : "ghost"}
                    className="w-full justify-start font-medium"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="flex gap-2 pt-2 border-t border-border mt-2">
                <Button
                  variant={language === "fr" ? "default" : "ghost"}
                  onClick={() => {
                    handleLanguageChange("fr");
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  Français
                </Button>
                <Button
                  variant={language === "ku" ? "default" : "ghost"}
                  onClick={() => {
                    handleLanguageChange("ku");
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  Kurdî
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
