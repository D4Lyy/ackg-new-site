import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, BookOpen, Users } from "lucide-react";
import ActivityCard from "@/components/ActivityCard";
import HeroSection from "@/components/HeroSection";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  image?: string;
  images?: string[];
}

const Home = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentLang = location.pathname.startsWith("/ku") ? "ku" : "fr";
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadActivities = async () => {
      const { data } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      setRecentActivities(data || []);
    };
    loadActivities();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        title={t("home.title")}
        subtitle={t("home.subtitle")}
        backgroundImage="/hero/slide.jpg"
      />

      {/* Mission Section */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.mission.title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Users className="w-12 h-12 mb-4 text-primary mx-auto" />
                <h3 className="text-xl font-bold mb-3 text-center">{t("home.mission.culture.title")}</h3>
                <p className="text-muted-foreground">
                  {t("home.mission.culture.desc")}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <BookOpen className="w-12 h-12 mb-4 text-accent mx-auto" />
                <h3 className="text-xl font-bold mb-3 text-center">{t("home.mission.language.title")}</h3>
                <p className="text-muted-foreground">
                  {t("home.mission.language.desc")}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Heart className="w-12 h-12 mb-4 text-secondary mx-auto" />
                <h3 className="text-xl font-bold mb-3 text-center">{t("home.mission.activities.title")}</h3>
                <p className="text-muted-foreground">
                  {t("home.mission.activities.desc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Language Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("home.courses.title")}</h2>
              <p className="text-lg text-muted-foreground mb-6 whitespace-pre-line">
                {t("home.courses.desc")}
              </p>
              <Button size="lg" asChild>
                <Link to={`/${currentLang}/cours-de-langues`}>{t("home.courses.button")}</Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
              <img
                src="/home/IMG_2457.jpg"
                alt="Language Courses"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      {/*<section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("home.support.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("home.support.desc")}
            </p>
            <Button size="lg" variant="default">
              <Link to={`/become-member.pdf`} target="_blank" rel="noopener noreferrer">
                {t("home.support.button")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>*/}

      {/* Princess Visit Section */}
      <section className="bg-muted/30 py-20 bg-[url('/bg/pattern.png')] bg-repeat bg-muted/100">
        <div className="container mx-auto px-4">
          {/*grid put second block on top when screen is small*/}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/20">
              <img
                src="/home/princess_visit.jpeg"
                alt="Princess Visit"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6">{t("home.princess.pre-title")}</h3>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-right uppercase">{t("home.princess.title")}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t("home.princess.desc")}
              </p>
              <p className="text-3xl text-right" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>- {t("home.princess.signature")}</p>
              <hr className="border-t-2 border-gray-400 mt-2 ml-auto" style={{ width: "150px" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("home.activities.title")}</h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t("home.activities.desc")}
          </p>
          <Button variant="outline" asChild>
            <Link to={`/${currentLang}/activites`}>{t("home.activities.viewAll")}</Link>
          </Button>
        </div>
        
        {recentActivities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivities.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {t("home.activities.none")}
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Home;
