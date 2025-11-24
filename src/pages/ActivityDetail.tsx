import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, MapPin, Share2, Copy, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  image?: string;
  images?: string[];
}

const ActivityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const currentLang = location.pathname.startsWith("/ku") ? "ku" : "fr";
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const loadActivity = async () => {
      if (slug) {
        const { data: activities } = await supabase
          .from('activities')
          .select('*');
        
        // Format slug to match activity title
        const foundActivity = activities?.find((a) => {
          const activitySlug = a.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return activitySlug === slug;
        });
        
        if (foundActivity) {
          setActivity(foundActivity);
        } else {
          navigate(`/${currentLang}/activites`);
        }
      }
    };
    loadActivity();
  }, [slug, navigate, currentLang]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("activity.copied"));
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(activity?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  if (!activity) return null;

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/${currentLang}/activites`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("activity.back")}
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-4xl font-bold">{activity.title}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le lien
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareFacebook}>
                  <Facebook className="w-4 h-4 mr-2" />
                  Partager sur Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareTwitter}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Partager sur X
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Carousel className="w-full">
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
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: activity.content.replace(/\n/g, "<br />") }} />
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
