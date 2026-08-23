-- ========================================================
-- OPTIONAL: SEED INITIAL PRODUCE & EQUIPMENT DATA
-- Run this in Supabase SQL Editor to populate sample items!
-- ========================================================

-- Insert Sample Products
INSERT INTO public.products (id, farmer_id, farmer_name, farmer_verified, name, category, price, unit, quantity, location, harvest_date, image_url, description)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', NULL, 'Ramesh Patil', true, 'Organic Red Tomatoes', 'Vegetables', 34.00, 'kg', 1200.00, 'Nashik, Maharashtra', CURRENT_DATE, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'Fresh Grade A vine-ripe tomatoes from Nashik valley.'),
  ('a0000000-0000-0000-0000-000000000002', NULL, 'Sunita Deshmukh', true, 'Sharbati Wheat (Premium)', 'Grains', 38.00, 'kg', 4500.00, 'Indore, Madhya Pradesh', CURRENT_DATE, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', 'High protein golden Sharbati wheat grains.'),
  ('a0000000-0000-0000-0000-000000000003', NULL, 'Vijay Kumar', true, 'Fresh Green Broccoli', 'Vegetables', 65.00, 'kg', 350.00, 'Pune, Maharashtra', CURRENT_DATE, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80', 'Pesticide-free organic broccoli heads.'),
  ('a0000000-0000-0000-0000-000000000004', NULL, 'Aniket Sharma', true, 'Organic Strawberries', 'Fruits', 351.00, 'kg', 500.00, 'Mahabaleshwar, Maharashtra', CURRENT_DATE, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80', 'Sweet Mahabaleshwar Grade A strawberries.')
ON CONFLICT (id) DO NOTHING;

-- Insert Sample FarmCheck Reports
INSERT INTO public.farmcheck_reports (product_id, overall_score, grade, weight_score, size_uniformity_score, color_reflectance_score, defect_score, verified)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 92, 'Grade A', 94, 90, 95, 89, true),
  ('a0000000-0000-0000-0000-000000000002', 88, 'Grade A', 90, 86, 91, 85, true),
  ('a0000000-0000-0000-0000-000000000003', 94, 'Grade A', 96, 92, 95, 93, true),
  ('a0000000-0000-0000-0000-000000000004', 96, 'Grade A', 98, 95, 97, 94, true)
ON CONFLICT (product_id) DO NOTHING;

-- Insert Sample Equipment
INSERT INTO public.equipment (id, owner_id, owner_name, name, category, daily_price, weekly_price, monthly_price, location, description, condition, year, rating, availability_status, image_url)
VALUES
  ('e0000000-0000-0000-0000-000000000001', NULL, 'Ramesh Patil', 'Mahindra 575 DI Tractor (45 HP)', 'Tractors', 1200.00, 7500.00, 28000.00, 'Nashik, Maharashtra', '45 HP power tractor suitable for heavy plowing and rotavator operations.', 'Excellent', 2024, 4.90, 'Available', 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'),
  ('e0000000-0000-0000-0000-000000000002', NULL, 'Suresh Pawar', 'Shaktiman Heavy Duty Rotavator (7 ft)', 'Rotavators', 650.00, 4000.00, 15000.00, 'Pune, Maharashtra', '7 feet wide rotavator for fine soil tilling.', 'Good', 2023, 4.70, 'Available', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;
