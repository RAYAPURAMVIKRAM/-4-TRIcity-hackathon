-- ==============================================================================
-- ProxyGrid Database Schema - Master Supabase (TriCity AI Hackathon)
-- Project: Team VQ (Rayapuram Vikram & Haseeba Mahanaz)
-- Target Host: https://rhomwvtmmkwepclzaiuu.supabase.co
-- Tables: proxygrid_errands, proxygrid_workers, proxygrid_activity_logs
-- ==============================================================================

-- 1. Workers / On-Ground Proxies Table
CREATE TABLE IF NOT EXISTS public.proxygrid_workers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    vehicle TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    completed_tasks INTEGER DEFAULT 328,
    phone TEXT,
    avatar_url TEXT,
    current_lat NUMERIC(9, 6) DEFAULT 17.994200,
    current_lng NUMERIC(9, 6) DEFAULT 79.563800,
    is_online BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Errands / Tasks Table
CREATE TABLE IF NOT EXISTS public.proxygrid_errands (
    id TEXT PRIMARY KEY,
    prompt TEXT NOT NULL,
    category TEXT NOT NULL,
    category_name TEXT,
    task_title TEXT,
    status TEXT NOT NULL DEFAULT 'placed', -- placed, assigned, arrived, in_progress, completed
    target_location TEXT,
    delivery_location TEXT,
    customer_phone TEXT,
    estimated_minutes INTEGER DEFAULT 25,
    distance_km NUMERIC(5, 2) DEFAULT 3.4,
    base_partner_fee NUMERIC(8, 2) DEFAULT 40.0,
    platform_fee NUMERIC(8, 2) DEFAULT 10.0,
    total_budget NUMERIC(8, 2) DEFAULT 120.0,
    assigned_worker_id TEXT REFERENCES public.proxygrid_workers(id) ON DELETE SET NULL,
    price_guard_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Live Activity & Audit Logs Table
CREATE TABLE IF NOT EXISTS public.proxygrid_activity_logs (
    id SERIAL PRIMARY KEY,
    errand_id TEXT REFERENCES public.proxygrid_errands(id) ON DELETE CASCADE,
    timestamp TEXT NOT NULL,
    message TEXT NOT NULL,
    log_type TEXT DEFAULT 'info', -- info, action, payment, completed, alert
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) & Public Hackathon Demo Access
-- ==============================================================================
ALTER TABLE public.proxygrid_workers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proxygrid_errands DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proxygrid_activity_logs DISABLE ROW LEVEL SECURITY;

GRANT ALL ON public.proxygrid_workers TO anon, authenticated, service_role;
GRANT ALL ON public.proxygrid_errands TO anon, authenticated, service_role;
GRANT ALL ON public.proxygrid_activity_logs TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ==============================================================================
-- Realistic Pre-Seeded TriCity (Warangal-Hanamkonda) Demo Data
-- ==============================================================================

-- Seed Workers
INSERT INTO public.proxygrid_workers (id, name, vehicle, rating, completed_tasks, phone, avatar_url, current_lat, current_lng, is_online)
VALUES 
    ('PRX-042', 'Ramesh K.', 'Hero Splendor (TS 03 AB 4421)', 4.90, 328, '+91 98480 22341', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 17.994200, 79.563800, TRUE),
    ('PRX-088', 'Suresh M.', 'Honda Activa (TS 03 EF 8820)', 4.85, 215, '+91 94401 11223', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 18.005100, 79.571200, TRUE),
    ('PRX-104', 'Ananya V.', 'TVS Jupiter (TS 03 CD 9912)', 4.95, 410, '+91 99887 66554', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 17.981400, 79.597700, TRUE)
ON CONFLICT (id) DO UPDATE SET is_online = TRUE;

-- Seed Errands
INSERT INTO public.proxygrid_errands (
    id, prompt, category, category_name, task_title, status, target_location, delivery_location, 
    customer_phone, estimated_minutes, distance_km, base_partner_fee, platform_fee, total_budget, 
    assigned_worker_id, price_guard_text
)
VALUES
    (
        'ORD-8941',
        'Go to the famous dosa stall near Hanamkonda chowrasta, buy 2 special ghee dosas, call me for payment at the stall, and deliver to my hostel.',
        'food_stall',
        'Local Stall Food / Street Vendor',
        'Fresh Ghee Dosa Pick-up & Delivery',
        'arrived',
        'Famous Dosa Stall, Hanamkonda Chowrasta',
        'Hostel Block 3, Kakatiya University Road',
        '+91 98765 43210',
        25,
        3.4,
        40.0,
        10.0,
        120.0,
        'PRX-042',
        'Price Guard: Dosa price capped at ₹60 each. Zero waiting fees applied.'
    ),
    (
        'ORD-8942',
        'Visit Warangal Municipal Office (GWMC) Counter 2, verify if property tax receipts are being issued offline today, and WhatsApp photo of notice board.',
        'ground_intel',
        'Ground Intel & Verification',
        'Municipal Counter 2 Offline Receipt Verification',
        'in_progress',
        'GWMC Municipal Office, Subedari',
        'WhatsApp Electronic Delivery',
        '+91 98480 33445',
        30,
        2.2,
        35.0,
        5.0,
        40.0,
        'PRX-088',
        'Verification Protocol: High-res photo proof required before settlement.'
    ),
    (
        'ORD-8943',
        'Go to electronics lane in Nakkalagutta, find an ESP32 development board under ₹450, verify pin headers, and purchase.',
        'buy',
        'Street Retail & Custom Product',
        'ESP32 Board Procurement & Pin Verification',
        'assigned',
        'Nakkalagutta Electronics Belts, Hanamkonda',
        'NIT Warangal Main Gate',
        '+91 97000 88990',
        35,
        4.1,
        40.0,
        5.0,
        450.0,
        'PRX-104',
        'Price Cap: Strictly refuse purchase if counter quote exceeds ₹450.'
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Activity Logs
INSERT INTO public.proxygrid_activity_logs (errand_id, timestamp, message, log_type)
VALUES
    ('ORD-8941', '14 mins ago', 'Errand confirmed & partner Ramesh K. dispatched on Hero Splendor.', 'info'),
    ('ORD-8941', '8 mins ago', 'Ramesh en route towards Hanamkonda Chowrasta (Speed: 32 km/h).', 'action'),
    ('ORD-8941', 'Just now', 'Ramesh arrived at stall counter. Live inspection photo captured.', 'action'),
    ('ORD-8942', '20 mins ago', 'Ground intel mission assigned to Suresh M.', 'info'),
    ('ORD-8942', '5 mins ago', 'Suresh entered GWMC Subedari complex. Queue inspection in progress.', 'action'),
    ('ORD-8943', '10 mins ago', 'Electronics errand registered. Price cap ₹450 locked in escrow.', 'info')
ON CONFLICT DO NOTHING;
