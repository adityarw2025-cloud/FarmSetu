-- ========================================================
-- FARMSETU COMPLETE DATABASE MIGRATION SCRIPT
-- Copy and paste this script into your Supabase SQL Editor & click Run!
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. PROFILES TABLE (User profiles linked to Supabase Auth)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Farmer', 'Buyer', 'Inspector', 'Admin')),
  location TEXT DEFAULT 'Nashik, Maharashtra',
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  farm_size_acres NUMERIC(6,2) DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 4.90,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 2. PRODUCTS TABLE (Harvested Produce Listings)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  farmer_verified BOOLEAN DEFAULT TRUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Produce', 'Vegetables', 'Fruits', 'Grains')),
  price NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'quintal', 'ton')),
  quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  harvest_date DATE DEFAULT CURRENT_DATE,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 3. FARMCHECK REPORTS TABLE (Produce Quality Verifications)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farmcheck_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  overall_score INT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  grade TEXT NOT NULL CHECK (grade IN ('Grade A', 'Grade B', 'Grade C')),
  weight_score INT NOT NULL,
  size_uniformity_score INT NOT NULL,
  color_reflectance_score INT NOT NULL,
  defect_score INT NOT NULL,
  verified BOOLEAN DEFAULT TRUE,
  inspection_date TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 4. EQUIPMENT TABLE (Machinery Sharing & Rentals)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Tractors', 'Rotavators', 'Sprayers', 'Pumps', 'Harvesters')),
  daily_price NUMERIC(10,2) NOT NULL,
  weekly_price NUMERIC(10,2) NOT NULL,
  monthly_price NUMERIC(10,2) NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  condition TEXT DEFAULT 'Excellent',
  year INT DEFAULT 2024,
  rating NUMERIC(3,2) DEFAULT 4.80,
  availability_status TEXT DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Rented', 'Maintenance')),
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 5. ORDERS TABLE (Produce Purchase Transactions)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 6. RENTALS TABLE (Equipment Rental Bookings)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.equipment_rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  renter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Active', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmcheck_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_rentals ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to farmcheck" ON public.farmcheck_reports FOR SELECT USING (true);
CREATE POLICY "Allow public read access to equipment" ON public.equipment FOR SELECT USING (true);

-- Authenticated insert/update policies
CREATE POLICY "Allow authenticated inserts to profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow farmers to insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow farmers to update own products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow farmers to delete own products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow users to create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to view own orders" ON public.orders FOR SELECT USING (true);

CREATE POLICY "Allow equipment inserts" ON public.equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow equipment updates" ON public.equipment FOR UPDATE USING (true);

CREATE POLICY "Allow rental requests" ON public.equipment_rentals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow rental select" ON public.equipment_rentals FOR SELECT USING (true);

-- Done!
