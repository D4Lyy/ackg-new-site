-- Add RLS policies for the activities_img bucket
CREATE POLICY "Anyone can view activity images"
ON storage.objects FOR SELECT
USING (bucket_id = 'activities_img');

CREATE POLICY "Authenticated users can upload activity images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'activities_img' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update activity images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'activities_img' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete activity images"
ON storage.objects FOR DELETE
USING (bucket_id = 'activities_img' AND auth.role() = 'authenticated');

-- Make the bucket public
UPDATE storage.buckets SET public = true WHERE id = 'activities_img';