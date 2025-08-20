# Supabase Setup Guide

This directory contains all the SQL scripts and configuration needed for the AI Room Styler backend.

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys from Settings > API

### 2. Run SQL Scripts
Execute the following scripts in your Supabase SQL Editor in this order:

1. **schema.sql** - Creates all tables and inserts default styles
2. **rls-policies.sql** - Enables Row Level Security and creates policies
3. **auth-trigger.sql** - Creates automatic user creation trigger

### 3. Create Storage Bucket
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `project-images`
3. Set it to public for development (can be changed later)

### 4. Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your actual Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep this secret!)

### 5. Grant Admin Access (Optional)
To make a user an admin, run this SQL with their email:
```sql
update users set role = 'admin' where email = 'your-email@example.com';
```

## Database Schema

### Tables
- **users**: User profiles with credits and roles
- **projects**: User projects/rooms
- **renders**: Before/after images and styling results
- **styles**: Available styling options

### Security
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Styles table is publicly readable
- Auth trigger automatically creates user records

## Testing
1. Sign up a new user via Google OAuth
2. Verify user record is created automatically
3. Test that users can't access other users' data
4. Confirm storage bucket accepts image uploads
