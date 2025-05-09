# Supabase Storage Migration Guide

This document provides instructions for migrating from UploadThing to Supabase Storage for file uploads in the HopeCamp website.

## Configuration Steps

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace `your_supabase_url_here` and `your_supabase_anon_key_here` with your actual Supabase project URL and anon key from the Supabase dashboard.

### 2. Set Up Storage Bucket and Policies

The migration includes a `supabase.policy.sql` file with SQL statements to create the necessary bucket and storage policies. You can apply these policies either through the Supabase dashboard SQL editor or through the Supabase CLI.

#### Option 1: Through Supabase Dashboard

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of `supabase.policy.sql` and run them

#### Option 2: Through Supabase CLI

1. Make sure you have the Supabase CLI installed
2. Run the following command:
   ```bash
   supabase db push --db-url your_db_connection_string
   ```

### 3. Migrating Existing Images

If you need to migrate existing images from UploadThing to Supabase Storage:

1. Download all existing images from UploadThing
2. Upload them to Supabase Storage using the Supabase dashboard or API
3. Update references in your database to point to the new Supabase URLs

## File Organization

Files are now organized in a logical hierarchy:

```
profile-images (bucket)
├── profile (category)
│   ├── user_123456 (user folder)
│   │   ├── 2023-05-20_abc123.jpg
│   │   └── 2023-06-15_def456.png
│   ├── user_789012 (another user)
│   │   └── 2023-07-10_ghi789.jpg
│   └── unregistered (for uploads without user IDs)
│       └── 2023-08-05_jkl012.jpg
└── documents (potential future category)
    └── ...
```

### File Naming Convention

Files are named with a pattern: `{date}_{randomId}.{extension}`

- `date`: ISO format date (YYYY-MM-DD) for easier chronological sorting
- `randomId`: A unique identifier to prevent collisions
- `extension`: Original file extension

## Metadata

Each uploaded file includes metadata:

- `originalName`: The original filename provided by the user
- `contentType`: The MIME type of the file
- `uploadedAt`: Timestamp of when the upload occurred
- `userName`: User's name (if available at upload time)
- `userAge`: User's age (if available at upload time)
- `editionId`: Camp edition ID (if applicable)

This metadata can be used for searching and filtering files in the Supabase dashboard.

## Implementation Details

The migration includes:

1. `utils/supabaseClient.ts` - Client utilities for Supabase Storage operations
2. `components/ui/SupabaseUploader.tsx` - A replacement component for UploadThing's UploadButton
3. API route at `app/api/storage/delete/route.ts` for handling file deletion for unauthenticated users
4. Updated components that previously used UploadThing

## Security Considerations

- The storage bucket is configured to allow public uploads since users may not be authenticated during registration
- File deletion is handled via two methods:
  - Direct Supabase client for authenticated users
  - API endpoint for unauthenticated users
- Storage policies are configured to allow users to manage only their own files

## Querying Files

The migration includes a PostgreSQL function to easily query files by user ID:

```sql
SELECT * FROM get_user_files('user_id_here');
```

This makes it easy to list all files belonging to a specific user.

## Future Enhancements

Potential improvements to consider:

1. Image transformations - Supabase supports on-the-fly image resizing and processing
2. Automatic image optimization - Convert uploaded images to WebP format
3. Multi-file upload support - Allow users to upload multiple files at once

## Troubleshooting

If you encounter issues with uploads or deletions:

1. Check your Supabase Storage logs in the dashboard
2. Verify that your environment variables are correctly set
3. Ensure the storage policies are properly applied
4. Check the browser console for any errors

For any further questions, please contact the development team. 