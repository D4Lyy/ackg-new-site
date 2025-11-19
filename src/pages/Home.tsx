import { Link } from "react-router-dom";
import { GraduationCap, Heart, Users } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ActivityCard from "@/components/ActivityCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getActivities } from "@/lib/activities";

const Home = () => {
  const activities = getActivities().slice(0, 3);

  return (
    <div className="min-h-screen">
      <HeroSection
        title="ASSOCIATION CULTURELLE KURDE DE GENÈVE"
        subtitle="Pour diffuser la culture kurde en Suisse"
      />

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Notre mission</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-3">Préservation de la culture</h3>
              <p className="text-sm text-muted-foreground">
                Notre but est la préservation, la défense et le développement des valeurs kurdes ainsi que l'intégration des kurdes dans la société helvétique
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-3">Apprentissage de la langue</h3>
              <p className="text-sm text-muted-foreground">
                Nous proposons des cours de langues pour tous les kurdes vivant en Suisse. Les cours sont enseignés par des enseignants kurdes expérimentés
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-3">Activités pour tous</h3>
              <p className="text-sm text-muted-foreground">
                Organisation d'événements culturels et sociaux afin de favoriser les liens entre Kurdes installés en Suisse
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Language Courses Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Cours de langue Kurde</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="aspect-video bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg overflow-hidden">
              {/* Placeholder for course image */}
            </div>
            <div>
              <p className="text-muted-foreground mb-6">
                Les enseignants utilisés de notre communauté kurde à Genève ont à cœur de transmettre la richesse de notre langue et de notre culture. Cours adaptés aux enfants, à partir de 5 ans qui bénéficient d'un apprentissage adapté, ludique et stimulant. Cours pour adultes également disponibles.
              </p>
              <Link to="/cours-de-langues">
                <Button size="lg" className="font-semibold">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Soutenir la diffusion de la culture kurde
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Votre soutien nous aide à continuer notre mission de préservation et de diffusion de la culture kurde en Suisse. Chaque contribution fait la différence.
            </p>
            <Button size="lg" variant="default" className="font-semibold">
              Faire un don
            </Button>
          </div>
        </div>
      </section>

      {/* Princess Visit Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-black/20"></div>
              {/* Placeholder pour photo de la visite */}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Visite à la princesse kurde</h2>
              <p className="text-muted-foreground mb-6">
                Nous avons eu l'honneur de recevoir la visite de la princesse kurde lors de notre événement culturel annuel. Une rencontre mémorable qui témoigne de l'importance de notre patrimoine et de nos traditions.
              </p>
              <Button size="lg" className="font-semibold">
                Découvrir l'événement
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Nos Activités</h2>
          <Link to="/activites">
            <Button variant="outline">Voir toutes</Button>
          </Link>
        </div>
        <p className="text-muted-foreground mb-8">
          Nous organisons de nombreuses activités, ouvertes à tous!
        </p>
        {activities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Aucune activité disponible pour le moment. Revenez bientôt!
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Home;
