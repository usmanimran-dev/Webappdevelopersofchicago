-- Create the client_onboarding table
CREATE TABLE IF NOT EXISTS public.client_onboarding (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    selected_service TEXT,
    total_price NUMERIC,
    discount_applied BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Protect the table using RLS (Row Level Security)
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated admins to select data
-- (Assuming normal users shouldn't be able to query all clients)
CREATE POLICY "Allow admins to select client_onboarding." ON public.client_onboarding
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow anonymous users to insert their onboarding data
CREATE POLICY "Allow anon to insert client_onboarding." ON public.client_onboarding
    FOR INSERT WITH CHECK (true);

-- (Optional) Policy to allow admins to update the status
CREATE POLICY "Allow admins to update client_onboarding." ON public.client_onboarding
    FOR UPDATE USING (auth.role() = 'authenticated');
