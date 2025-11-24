-- Add slug column to activities table
ALTER TABLE public.activities ADD COLUMN slug text UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_activities_slug ON public.activities(slug);

-- Generate slugs for existing activities (8 random alphanumeric characters)
UPDATE public.activities 
SET slug = lower(
  substring(md5(random()::text || id::text) from 1 for 8)
)
WHERE slug IS NULL;