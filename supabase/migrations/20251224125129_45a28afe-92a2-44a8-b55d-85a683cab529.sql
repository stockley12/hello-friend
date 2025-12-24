-- Insert missing services from the salon's offerings
INSERT INTO public.services (id, name, category, gender, duration_min, price, description, active)
VALUES 
  (gen_random_uuid(), 'Knotless Braids', 'braids', 'female', 240, 200, 'Lightweight, tension-free braids that start flat at the root for a natural look.', true),
  (gen_random_uuid(), 'Fulani Braids', 'braids', 'female', 180, 160, 'Beautiful tribal-inspired style with beads and accessories.', true),
  (gen_random_uuid(), 'Twist Styles', 'twists', 'female', 150, 120, 'Senegalese twists, passion twists, or marley twists - your choice!', true),
  (gen_random_uuid(), 'Natural Hair Styling', 'natural', 'female', 60, 60, 'Wash, condition, and style for natural curls and coils.', true),
  (gen_random_uuid(), 'Fade Haircut', 'mens', 'male', 45, 50, 'Sharp fade cuts - low, mid, or high. Includes lineup and styling.', true)
ON CONFLICT DO NOTHING;