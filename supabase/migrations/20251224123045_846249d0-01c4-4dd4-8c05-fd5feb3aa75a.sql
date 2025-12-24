-- Create storage bucket for gallery media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Allow public read access to gallery bucket
CREATE POLICY "Public read access for gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Allow authenticated/public insert access
CREATE POLICY "Public insert access for gallery"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

-- Allow public delete access for gallery
CREATE POLICY "Public delete access for gallery"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery');

-- Add media_type column to gallery table to distinguish images from videos
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';

-- Update the column to have a constraint
ALTER TABLE public.gallery 
ADD CONSTRAINT gallery_media_type_check 
CHECK (media_type IN ('image', 'video'));