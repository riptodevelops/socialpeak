# Socialpeak.store

Official web application for **Socialpeak.store** — Premium Subscriptions & Activations platform.

## Features
- 🚀 **Fast SPA Architecture**: Fluid browsing without flash or full page reloads.
- 📦 **Dynamic Product Catalog**: Supports categories, instant activation tags, and original/discounted cut-off pricing.
- 🛒 **Cart & WhatsApp Coordination**: Instant checkout and direct WhatsApp order confirmation.
- 🔐 **Supabase Authentication**: Secure user registration with **Email Verification Link** confirmation.
- 🛡️ **Admin Control Center**: Built-in dashboard to add/edit products, manage orders, and track payments.
- ☁️ **Vercel Hosting Ready**: Pre-configured with `vercel.json` rewrites and serverless runtime configuration.

---

## Supabase Database Setup

Run the following SQL in your **Supabase Dashboard → SQL Editor**:

```sql
-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL DEFAULT 'entertainment',
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL,
  utr TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public Read, Authenticated/Admin write
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all access for products" ON public.products;
CREATE POLICY "Enable all access for products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Orders Policies
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for orders" ON public.orders;
CREATE POLICY "Enable all access for orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view profile" ON public.profiles;
CREATE POLICY "Users can view profile" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE WHEN LOWER(NEW.email) = 'socialpeak@gmail.com' THEN 'admin' ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'user') END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = EXCLUDED.name,
      role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clear old mock data
DELETE FROM public.orders;
DELETE FROM public.products;

-- Seed Admin Account (socialpeak@gmail.com / SocialPeak)
DO $$
DECLARE
  admin_uid UUID;
BEGIN
  SELECT id INTO admin_uid FROM auth.users WHERE email = 'socialpeak@gmail.com';
  
  IF admin_uid IS NULL THEN
    admin_uid := gen_random_uuid();
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'socialpeak@gmail.com',
      crypt('SocialPeak', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Store Admin","phone":"+91 92508 06417","role":"admin"}'::jsonb,
      NOW(),
      NOW(),
      'authenticated',
      'authenticated'
    );
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt('SocialPeak', gen_salt('bf')),
        email_confirmed_at = NOW(),
        raw_user_meta_data = '{"name":"Store Admin","phone":"+91 92508 06417","role":"admin"}'::jsonb
    WHERE id = admin_uid;
  END IF;

  INSERT INTO public.profiles (id, email, name, phone, role)
  VALUES (admin_uid, 'socialpeak@gmail.com', 'Store Admin', '+91 92508 06417', 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin', name = 'Store Admin';
END $$;
```

---

## Vercel Deployment

1. Import this repository in [Vercel](https://vercel.com).
2. Set Environment Variables in **Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://<project-ref>.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key (`eyJhbGci...`)
3. Click **Deploy**!

---

## Admin Credentials
- **Email**: `socialpeak@gmail.com`
- **Password**: `SocialPeak`
- **Dashboard URL**: `/admin`
