import { Calendar, Clock, MapPin, Users } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const LanguageCourses = () => {
  const scheduleData = [
    { day: "Lu", times: ["18:00 - 19:30"] },
    { day: "Ma", times: ["18:00 - 19:30"] },
    { day: "Me", times: ["18:00 - 19:30"] },
    { day: "Je", times: ["18:00 - 19:30"] },
    { day: "Ve", times: ["18:00 - 19:30"] },
    { day: "Sa", times: [] },
    { day: "Di", times: [] },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection title="Cours de langues" />

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Description */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Une communauté locale de Suisse romande présente sur les réseaux sociaux
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Découvrez l'art captivant du Kurde, enseigné par des professionnels passionnés. Nos cours s'adaptent à tous les niveaux, des débutants curieux aux danseurs expérimentés.
              </p>
              <p>
                Notre communauté accueille également des élèves non Kurdes souhaitant s'initier à cet art ancestral enrichi de nombreuses influences culturelles. Rejoignez-nous pour explorer les joies de cette langue riche et vibrante.
              </p>
              <p>
                En plus des cours réguliers, nous organisons également des événements spéciaux, des ateliers et des spectacles tout au long de l'année, offrant ainsi l'opportunité d'approfondir vos connaissances et de partager votre passion avec d'autres membres de la communauté.
              </p>
            </div>
          </div>

          {/* Image Carousel */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {[1, 2, 3].map((i) => (
                  <CarouselItem key={i}>
                    <div className="aspect-video bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg overflow-hidden">
                      {/* Placeholder for carousel images */}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">L'EMPLOI DU TEMPS D'ÉTUDIANTS</h3>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-7 gap-2">
                {scheduleData.map((day) => (
                  <div key={day.day} className="text-center">
                    <div className="font-semibold mb-2">{day.day}</div>
                    <div className="space-y-1">
                      {day.times.map((time, i) => (
                        <div key={i} className="text-sm bg-primary/5 p-2 rounded">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">Horaires flexibles</h4>
              <p className="text-sm text-muted-foreground">
                Cours disponibles en semaine et le weekend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <h4 className="font-semibold mb-2">Petits groupes</h4>
              <p className="text-sm text-muted-foreground">
                Maximum 12 élèves par classe
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-accent" />
              <h4 className="font-semibold mb-2">1h30 par cours</h4>
              <p className="text-sm text-muted-foreground">
                Sessions intensives et efficaces
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">Centre-ville</h4>
              <p className="text-sm text-muted-foreground">
                Facilement accessible en transport
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
          <CardContent className="p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Inscrivez-vous dès maintenant
            </h3>
            <p className="text-muted-foreground mb-6">
              Les places sont limitées. Rejoignez notre communauté d'apprentissage!
            </p>
            <Button size="lg" className="font-semibold">
              Contactez-nous
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LanguageCourses;
