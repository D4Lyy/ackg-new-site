import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Building2, Mail, Phone, MapPin, Server } from "lucide-react";

const LegalNotice = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <section className="relative h-[10vh] min-h-[150px] flex items-center justify-center overflow-hidden mt-20">
        <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-black mt-8">
          {t("legal.title")}
        </h1>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Association Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-3 mb-4">
                <Building2 className="w-6 h-6 text-primary mt-1" />
                <h2 className="text-2xl font-bold">{t("legal.association.title")}</h2>
              </div>
              <div className="space-y-3 ml-9">
                <div>
                  <p className="font-semibold">{t("legal.association.name")}</p>
                  <p className="text-muted-foreground">Association Culturelle Kurde de Genève (ACKG)</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-semibold">{t("legal.association.address")}</p>
                    <p className="text-muted-foreground">Avenue Edmond-Vaucher 19, 1219 Châtelaine, Genève, Suisse</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">{t("legal.association.phone")}: </span>
                    <span className="text-muted-foreground">+41 77 996 73 63</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">{t("legal.association.email")}: </span>
                    <a href="mailto:contact@ackg.ch" className="text-primary hover:underline">
                      contact@ackg.ch
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publication Director */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t("legal.editor.title")}</h2>
              <p className="text-muted-foreground">
                Association Culturelle Kurde de Genève
              </p>
            </CardContent>
          </Card>

          {/* Personal Data */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t("legal.data.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("legal.data.content")}
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t("legal.cookies.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("legal.cookies.content")}
              </p>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t("legal.property.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("legal.property.content")}
              </p>
            </CardContent>
          </Card>

          {/* Liability */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t("legal.liability.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("legal.liability.content")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LegalNotice;
