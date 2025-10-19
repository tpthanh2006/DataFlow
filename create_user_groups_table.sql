-- SQL script to create the user_groups table
-- Run this in your Supabase SQL editor to create the table

CREATE TABLE IF NOT EXISTS public.user_groups (
    group_name TEXT PRIMARY KEY,
    group_description TEXT NOT NULL,
    user_emails TEXT[] NOT NULL DEFAULT '{}'
);

-- Add some sample data
INSERT INTO public.user_groups (group_name, group_description, user_emails) VALUES
    ('Teachers 2025', 'All teachers for the 2025 academic year', ARRAY['john.smith@isf-cambodia.org', 'sarah.johnson@isf-cambodia.org']),
    ('Administrators', 'School administration staff', ARRAY['admin@isf-cambodia.org', 'principal@isf-cambodia.org']),
    ('Support Staff', 'Support and maintenance staff', ARRAY['janitor@isf-cambodia.org', 'it@isf-cambodia.org'])
ON CONFLICT (group_name) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read the data
CREATE POLICY "Allow authenticated users to read user groups" ON public.user_groups
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create a policy that allows admin users to insert/update/delete
CREATE POLICY "Allow admin users to manage user groups" ON public.user_groups
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Note: group_name is already the primary key, so no additional index needed

-- Create an index on user_emails for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_groups_user_emails ON public.user_groups USING GIN(user_emails);