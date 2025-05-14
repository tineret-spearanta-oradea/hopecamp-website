-- Create the 'profile-images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow anyone to upload files to the profile-images bucket
-- This is needed since users may not be authenticated during registration
CREATE POLICY "Allow public uploads to profile-images" ON storage.objects
FOR INSERT TO public
WITH CHECK (
  bucket_id = 'profile-images'
);

-- Policy to allow only object owners to update their files
-- If a user is authenticated, they can only update their own files
CREATE POLICY "Allow owners to update their files" ON storage.objects
FOR UPDATE TO public
USING (
  bucket_id = 'profile-images' AND (
    auth.uid() = owner OR 
    -- Also allow if the path starts with their user_id folder
    (auth.uid() IS NOT NULL AND path LIKE 'profile/user_' || auth.uid() || '/%')
  )
)
WITH CHECK (
  bucket_id = 'profile-images' AND (
    auth.uid() = owner OR 
    -- Also allow if the path starts with their user_id folder
    (auth.uid() IS NOT NULL AND path LIKE 'profile/user_' || auth.uid() || '/%')
  )
);

-- Policy to allow everyone to read/view files from profile-images
CREATE POLICY "Allow public to view profile-images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profile-images');

-- Policy to allow object owners or authenticated users to delete their files
-- A user can delete if they're the owner or if the file is in their folder
CREATE POLICY "Allow owners to delete their files" ON storage.objects
FOR DELETE TO public
USING (
  bucket_id = 'profile-images' AND (
    auth.uid() = owner OR 
    -- Also allow if the path starts with their user_id folder
    (auth.uid() IS NOT NULL AND path LIKE 'profile/user_' || auth.uid() || '/%')
  )
);

-- For non-authenticated users, we'll rely on the API endpoint to handle deletion
-- That will use the service role key which bypasses RLS

-- Let's also add helper functions to list files by user ID
CREATE OR REPLACE FUNCTION get_user_files(user_id TEXT)
RETURNS TABLE (
  name TEXT,
  id UUID,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  metadata JSONB,
  path TEXT,
  size BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT name, id, updated_at, created_at, last_accessed_at, metadata, path, size
  FROM storage.objects
  WHERE bucket_id = 'profile-images' 
    AND (path LIKE 'profile/user_' || user_id || '/%')
$$; 