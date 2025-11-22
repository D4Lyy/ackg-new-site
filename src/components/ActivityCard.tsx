import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { formatUrlSlug } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivityCardProps {
  title: string;
  date: string;
  location: string;
  image?: string;
}

interface ActivityCardPropsExtended extends ActivityCardProps {
  images?: string[];
}

const ActivityCard = ({ title, date, location, image, images }: ActivityCardPropsExtended) => {
  const { language } = useLanguage();
  const slug = formatUrlSlug(title);
  const displayImage = images && images.length > 0 ? images[0] : image;

  return (
    <Link to={`/${language}/activite/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
          {displayImage && (
            <img src={displayImage} alt={title} className="w-full h-full object-cover" />
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Date de l'activité: {date}</p>
            <p>Lieu de l'activité: {location}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ActivityCard;
