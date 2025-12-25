-- Fix incorrect placeholder numbers so WhatsApp booking always goes to the salon owner
-- (previously: +905330000000)
UPDATE public.settings
SET
  phone = '+905338709271',
  whatsapp_number = '+905338709271'
WHERE id = 1;
