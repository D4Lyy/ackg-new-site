export interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  image?: string;
  images?: string[];
}

const ACTIVITIES_KEY = "ackg_activities";

export const getActivities = (): Activity[] => {
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const getActivityBySlug = (slug: string): Activity | null => {
  const activities = getActivities();
  return activities.find((a) => a.id === slug) || null;
};

export const saveActivity = (activity: Omit<Activity, "id">): Activity => {
  const activities = getActivities();
  const id = Date.now().toString();
  const newActivity = { ...activity, id };
  activities.push(newActivity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  return newActivity;
};

export const updateActivity = (id: string, updates: Partial<Activity>): void => {
  const activities = getActivities();
  const index = activities.findIndex((a) => a.id === id);
  if (index !== -1) {
    activities[index] = { ...activities[index], ...updates };
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  }
};

export const deleteActivity = (id: string): void => {
  const activities = getActivities();
  const filtered = activities.filter((a) => a.id !== id);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filtered));
};
