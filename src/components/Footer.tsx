import { Facebook, Phone, Mail, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentLang = location.pathname.startsWith("/ku") ? "ku" : "fr";

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to={`/${currentLang}/home`} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <img
                src="/logo.png"
                alt="ACKG Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold text-lg">ACKG</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+41 77 996 73 63</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@ackg.ch" className="hover:text-primary transition-colors">
                  info@ackg.ch
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                <a
                  href="https://www.facebook.com/people/Komela-Kultûrê-Kurdî-li-Cinêvê/100063537401743"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Facebook
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                <a
                  href="https://www.instagram.com/ack_geneve/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.legal")}</h3>
            <div className="space-y-2 text-sm">
              <Link to={`/${currentLang}/legal-notice`} className="block hover:text-primary transition-colors">
                {t("footer.mentions")}
              </Link>
              <Link to={`/${currentLang}/about`} className="block hover:text-primary transition-colors">
                {t("footer.about")}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 {t("footer.association")}. {t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
