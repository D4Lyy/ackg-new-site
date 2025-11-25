import { Users, Heart, BookOpen, Handshake } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  
  const teamMembers = [
    { name: "Nom Prénom", role: "Fonction" },
    { name: "Nom Prénom", role: "Fonction" },
    { name: "Nom Prénom", role: "Fonction" },
    { name: "Nom Prénom", role: "Fonction" },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection title={t("about.title")} />

      <section className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">{t("about.mission.title")}</h2>
          <div className="prose prose-lg">
            <p className="text-muted-foreground leading-relaxed">
              {t("about.mission.desc")}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t("about.values.title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">{t("about.values.culture")}</h3>
                <p className="text-sm text-muted-foreground">
                  Maintenir vivantes les traditions, la langue et les valeurs kurdes pour les générations futures
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">{t("about.values.education")}</h3>
                <p className="text-sm text-muted-foreground">
                  Promouvoir les échanges culturels entre la communauté kurde et la société suisse
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">{t("about.values.solidarity")}</h3>
                <p className="text-sm text-muted-foreground">
                  Accompagner l'intégration des Kurdes en Suisse tout en préservant leur identité culturelle
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">{t("about.team.title")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Users className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card className="mt-16 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">{t("about.contact.title")}</h3>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Facebook Embed */}
              <div className="flex justify-center w-full">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpeople%2FKomela-Kult%C3%BBr%C3%AA-Kurd%C3%AE-li-Cin%C3%AAv%C3%AA%2F100063537401743&tabs&width=340&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  className="w-full max-w-[340px]"
                  height="300"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 text-muted-foreground">
                <p className="font-semibold text-foreground">Association Culturelle Kurde de Genève</p>
                <p><strong>{t("about.contact.address")}:</strong> Genève, Suisse</p>
                <p>
                  <strong>{t("about.contact.phone")}:</strong>{" "}
                  <a href="tel:+41779967363" className="hover:text-primary transition-colors">
                    +41 77 996 73 63
                  </a>
                </p>
                <p>
                  <strong>{t("about.contact.email")}:</strong>{" "}
                  <a href="mailto:info@ackg.ch" className="hover:text-primary transition-colors">
                    info@ackg.ch
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default About;
