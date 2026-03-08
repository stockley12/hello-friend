
ALTER TABLE availability 
ADD COLUMN IF NOT EXISTS weekly_schedule jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS slot_duration_minutes integer DEFAULT 60,
ADD COLUMN IF NOT EXISTS max_bookings_per_slot integer DEFAULT 1;
