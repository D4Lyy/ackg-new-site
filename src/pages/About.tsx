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
      <section className="relative h-[10vh] min-h-[150px] flex items-center justify-center overflow-hidden mt-20 bg-muted/100 bg-[url('/bg/pattern.png')] bg-repeat pb-10">
        <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-black mt-8">
          {t("about.title")}
        </h1>
      </section>

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
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Heart className="w-12 h-12 mb-4 text-primary mx-auto" />
                <h3 className="text-xl font-bold mb-3">{t("about.values.culture")}</h3>
                <p className="text-muted-foreground">
                  {t("about.values.culture.desc")}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <BookOpen className="w-12 h-12 mb-4 text-accent mx-auto" />
                <h3 className="text-xl font-bold mb-3">{t("about.values.education")}</h3>
                <p className="text-muted-foreground">
                  {t("about.values.education.desc")}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Handshake className="w-12 h-12 mb-4 text-secondary mx-auto" />
                <h3 className="text-xl font-bold mb-3">{t("about.values.solidarity")}</h3>
                <p className="text-muted-foreground">
                  {t("about.values.solidarity.desc")}
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
            <h3 className="text-3xl font-bold mb-8 text-center">{t("about.contact.title")}</h3>
            <div className="items-center justify-center flex flex-col gap-4 md:gap-8 md:flex-row">              
              {/* Contact Info */}
              <div className="space-y-3 text-muted-foreground px-4 text-xl text-left md:px-0 md:text-xl">
                <p className="font-semibold text-foreground break-words text-center mb-6">Association Culturelle Kurde de Genève</p>
                <p className="break-words"><strong>{t("about.contact.address")}:</strong>{" "}
                  Avenue Edmond-Vaucher 19, 1219 Châtelaine, Genève, Suisse
                </p>
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
