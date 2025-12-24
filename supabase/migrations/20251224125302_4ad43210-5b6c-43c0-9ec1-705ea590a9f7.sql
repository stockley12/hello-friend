-- Normalize category values to lowercase to match the app's expected values
UPDATE public.services SET category = LOWER(category);

-- Also normalize 'Natural Styles' to 'natural'
UPDATE public.services SET category = 'natural' WHERE LOWER(category) = 'natural styles';