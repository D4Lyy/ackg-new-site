import { Users, Heart, BookOpen, Handshake } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  
  const teamMembers = [
    { name: "Aziz Kalo", role: "Président", image: "/about/aziz-249x300.png" },
    { name: "Xdr Alyar", image: "/about/Xdr-249x300.png" },
    { name: "Ismail Miro", image: "/about/1-249x300.png" },
    { name: "Lina Oskan", image: "/about/3333-249x300.png" },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection 
      title={t("about.title")}
      backgroundImage="/hero/fondateurs.jpg"
      />

      <section className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">{t("about.mission.title")}</h2>
          <div className="prose prose-lg">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-justify">
              {t("about.mission.desc")}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t("about.values.title")}</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <Card>
              <CardContent className="p-6">
                <Heart className="w-12 h-12 mb-4 text-primary mx-auto" />
                <h3 className="font-semibold mb-3">{t("about.values.culture")}</h3>
                <p className="text-sm text-muted-foreground">
                  Maintenir vivantes les traditions, la langue et les valeurs kurdes pour les générations futures
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <BookOpen className="w-12 h-12 mb-4 text-accent mx-auto" />
                <h3 className="font-semibold mb-3">{t("about.values.education")}</h3>
                <p className="text-sm text-muted-foreground">
                  Promouvoir les échanges culturels entre la communauté kurde et la société suisse
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Handshake className="w-12 h-12 mb-4 text-secondary mx-auto" />
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
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full from-primary/20 to-accent/20 flex items-center justify-center">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Users className="w-full h-full text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  {member.role ? (
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  ) : null}
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
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 text-muted-foreground">
                <p className="font-semibold text-foreground break-words">Association Culturelle Kurde de Genève</p>
                <p className="break-words"><strong>{t("about.contact.address")}:</strong> Genève, Suisse</p>
                <p className="break-words">
                  <strong>{t("about.contact.phone")}:</strong>{" "}
                  <a href="tel:+41779967363" className="hover:text-primary transition-colors break-all">
                    +41 77 996 73 63
                  </a>
                </p>
                <p className="break-words">
                  <strong>{t("about.contact.email")}:</strong>{" "}
                  <a href="mailto:info@ackg.ch" className="hover:text-primary transition-colors break-all">
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
