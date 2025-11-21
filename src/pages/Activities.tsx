import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ActivityCard from "@/components/ActivityCard";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getActivities, type Activity } from "@/lib/activities";

const Activities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      const data = await getActivities();
      setActivities(data);
      setLoading(false);
    };
    loadActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    
    const query = searchQuery.toLowerCase();
    return activities.filter(
      (activity) =>
        activity.title.toLowerCase().includes(query) ||
        activity.location.toLowerCase().includes(query) ||
        activity.content.toLowerCase().includes(query)
    );
  }, [activities, searchQuery]);

  return (
    <div className="min-h-screen">
      <HeroSection title="Nos activités" />

      <section className="container mx-auto px-4 py-16">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une activité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Chargement des activités...</p>
            </CardContent>
          </Card>
        ) : filteredActivities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Aucune activité trouvée pour votre recherche."
                  : "Aucune activité disponible pour le moment."}
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Activities;
