import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getActivityBySlug, type Activity } from "@/lib/activities";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ActivityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (slug) {
      const foundActivity = getActivityBySlug(slug);
      if (foundActivity) {
        setActivity(foundActivity);
      } else {
        navigate("/activites");
      }
    }
  }, [slug, navigate]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity?.title,
          url: url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Lien copié dans le presse-papier!");
    }
  };

  if (!activity) return null;

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/activites")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux activités
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-4xl font-bold">{activity.title}</h1>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{activity.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{activity.location}</span>
            </div>
          </div>
        </div>

        {/* Images Carousel */}
        {activity.images && activity.images.length > 0 && (
          <div className="mb-8">
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {activity.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${activity.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: activity.content.replace(/\n/g, "<br />") }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityDetail;
