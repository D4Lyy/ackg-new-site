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
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageCourses = () => {
  const { t } = useLanguage();
  
  const scheduleData = [
    { day: "Lu", times: ["18:00 - 19:30"] },
    { day: "Ma", times: ["18:00 - 19:30"] },
    { day: "Me", times: ["18:00 - 19:30"] },
    { day: "Je", times: ["18:00 - 19:30"] },
    { day: "Ve", times: ["18:00 - 19:30"] },
    { day: "Sa", times: [] },
    { day: "Di", times: [] },
  ];

  const slides = import.meta.glob("/public/language_courses_slides/*.{png,jpg,jpeg,webp}", {
    eager: true,
    import: "default",
  });

  const imageUrls = Object.values(slides);

  console.log(imageUrls);

  return (
    <div className="min-h-screen">
      <HeroSection 
        title={t("courses.title")}
        subtitle={t("courses.subtitle")}
        backgroundImage="/hero/language_courses.jpg"
      />

      <section className="container mx-auto px-4 py-10">
        <div className={`grid gap-12 items-center mb-16 ${imageUrls.length > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-1 w-[80%] mx-auto'}`}>
          {/* Description */}
          <div>
            <h2 className={`text-3xl font-bold mb-6 ${imageUrls.length > 0 ? '' : 'text-center'}`}>
              {t("courses.desc")}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>{t("courses.info.desc")}</p>
            </div>
          </div>

          {/* Image Carousel */}
          {imageUrls.length > 0 ? (
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  {imageUrls.map((url, i) => (
                    // if mobile, set height to 300px, else 500px
                    <CarouselItem key={i}>
                      <img
                        src={`${url}`}
                        alt={`Slide ${i}`}
                        className="aspect-video w-full h-[300px] md:h-[500px] object-cover rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          ) : null}
        </div>
      </section>

      {/* Alphabet Section */}
        <section className="bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-lg overflow-hidden w-full max-w-[400px] mx-auto">
              <img
                src="/language_courses/alphabet_2025_page-0001.jpg"
                alt="Alphabet"
                className="w-full rounded-lg h-auto"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 break-words">{t("courses.alphabet")}</h2>
              <p className="text-lg text-muted-foreground mb-6 whitespace-pre-line">
                {t("courses.alphabet.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {/* Course Info */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">{t("courses.info.title")}</h3>
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t("courses.info.children")}</h4>
                  <p className="text-muted-foreground">{t("courses.schedule.children")}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t("courses.info.teens")}</h4>
                  <p className="text-muted-foreground">{t("courses.schedule.teens")}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t("courses.info.adults")}</h4>
                  <p className="text-muted-foreground">{t("courses.schedule.adults")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">{t("courses.cards.schedule.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("courses.cards.schedule.desc")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <h4 className="font-semibold mb-2">{t("courses.cards.groups.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("courses.cards.groups.desc")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-accent" />
              <h4 className="font-semibold mb-2">{t("courses.cards.duration.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("courses.cards.duration.desc")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">{t("courses.cards.location.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("courses.cards.location.desc")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
          <CardContent className="p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              {t("courses.register")}
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
