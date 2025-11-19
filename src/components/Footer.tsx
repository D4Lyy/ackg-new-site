import { Facebook, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kurdish-red via-kurdish-yellow to-kurdish-green p-1">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">AK</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold">Association Culturelle</div>
                <div className="text-xs text-muted-foreground">Kurde de Genève</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              L'Association de la culture kurde à Genève est une association culturelle qui a pour but la diffusion et la promotion de la culture kurde en Suisse ainsi qu'en Europe.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <a
                href="tel:+41779967363"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                +41 77 996 73 63
              </a>
              <a
                href="mailto:info@ackg.ch"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@ackg.ch
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Informations</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Mentions légales
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2025 ACKG. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
