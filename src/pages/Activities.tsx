import { useState, useMemo, useEffect } from "react";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import HeroSection from "@/components/HeroSection";
import ActivityCard from "@/components/ActivityCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  image?: string;
  images?: string[];
  slug?: string;
}

const ITEMS_PER_PAGE = 12;

const Activities = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadActivities = async () => {
      const { data } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });
      setActivities(data || []);
      setLoading(false);
    };
    loadActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    let filtered = activities;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.location.toLowerCase().includes(query) ||
          activity.content.toLowerCase().includes(query)
      );
    }
    
    // Filter by date
    if (date) {
      const dateString = format(date, "yyyy-MM-dd");
      filtered = filtered.filter((activity) =>
        activity.date.includes(dateString)
      );
    }
    
    return filtered;
  }, [activities, searchQuery, date]);

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredActivities, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, date]);

  return (
    <div className="min-h-screen">
      <HeroSection title={t("activities.title")} />

      <section className="container mx-auto px-4 py-16">
        {/* Search and Filters */}
        <div className="max-w-2xl mx-auto mb-12 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("activities.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{t("admin.activity.dateFilter")}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
              {date && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setDate(undefined)}
                  >
                    Effacer la date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Chargement des activités...</p>
            </CardContent>
          </Card>
        ) : filteredActivities.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedActivities.map((activity) => (
                <ActivityCard key={activity.id} {...activity} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || date
                  ? t("activities.noresults")
                  : t("activities.none")}
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Activities;
