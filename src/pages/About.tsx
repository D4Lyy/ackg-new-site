import { Users } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const teamMembers = [
    { name: "Nom Prénom", role: "Fonction" },
    { name: "Nom Prénom", role: "Fonction" },
    { name: "Nom Prénom", role: "Fonction" },
    { name: "Nom Prénom", role: "Fonction" },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection title="Qui sommes nous ?" />

      <section className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="prose prose-lg">
            <p className="text-muted-foreground leading-relaxed">
              L'Association de la culture kurde à Genève est une association culturelle qui a pour but la diffusion et la promotion de la culture kurde en Suisse. Elle a été fondée en 2015 par un groupe de kurdes vivant à Genève, désireux de faire connaître leur culture et leur patrimoine.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Notre association organise régulièrement des événements culturels, des expositions, des conférences et des cours de langue kurde. Nous travaillons également en étroite collaboration avec d'autres associations kurdes en Suisse et en Europe afin de promouvoir la culture kurde et de soutenir la communauté kurde.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              L'objectif principal de notre association est de préserver et de diffuser la richesse de la culture kurde, tout en favorisant l'intégration des Kurdes dans la société suisse. Nous croyons fermement que la diversité culturelle enrichit notre société et qu'il est important de célébrer et de partager nos traditions.
            </p>
          </div>
        </div>

        {/* Mission Points */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Préserver notre culture</h3>
              <p className="text-sm text-muted-foreground">
                Maintenir vivantes les traditions, la langue et les valeurs kurdes pour les générations futures
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Favoriser la culture locale</h3>
              <p className="text-sm text-muted-foreground">
                Promouvoir les échanges culturels entre la communauté kurde et la société suisse
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Soutenir le développement</h3>
              <p className="text-sm text-muted-foreground">
                Accompagner l'intégration des Kurdes en Suisse tout en préservant leur identité culturelle
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Notre équipe</h2>
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
          <CardContent className="p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Association Culturelle Kurde de Genève</p>
              <p>Genève, Suisse</p>
              <p className="mt-4">
                <a href="tel:+41779967363" className="hover:text-primary">
                  +41 77 996 73 63
                </a>
              </p>
              <p>
                <a href="mailto:info@ackg.ch" className="hover:text-primary">
                  info@ackg.ch
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default About;
