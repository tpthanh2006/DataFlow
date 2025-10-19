-- SQL script to create the isf_staff_emails table
-- Run this in your Supabase SQL editor to create the table

CREATE TABLE IF NOT EXISTS public.isf_staff_emails (
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL UNIQUE,
    PRIMARY KEY ("Email")
);

-- Add some sample data
INSERT INTO public.isf_staff_emails ("Name", "Email") VALUES
    ('John Smith', 'john.smith@isf-cambodia.org'),
    ('Sarah Johnson', 'sarah.johnson@isf-cambodia.org'),
    ('Mike Davis', 'mike.davis@isf-cambodia.org'),
    ('Emily Chen', 'emily.chen@isf-cambodia.org'),
    ('David Wilson', 'david.wilson@isf-cambodia.org'),
    ('Lisa Brown', 'lisa.brown@isf-cambodia.org'),
    ('Robert Taylor', 'robert.taylor@isf-cambodia.org'),
    ('Maria Garcia', 'maria.garcia@isf-cambodia.org')
ON CONFLICT ("Email") DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.isf_staff_emails ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read the data
CREATE POLICY "Allow authenticated users to read staff emails" ON public.isf_staff_emails
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create a policy that allows admin users to insert/update/delete
CREATE POLICY "Allow admin users to manage staff emails" ON public.isf_staff_emails
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Create an index on Name for faster searches
CREATE INDEX IF NOT EXISTS idx_isf_staff_emails_name ON public.isf_staff_emails("Name");

-- Create an index on Email for faster lookups
CREATE INDEX IF NOT EXISTS idx_isf_staff_emails_email ON public.isf_staff_emails("Email");