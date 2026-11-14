-- Neuer Bereich "aimma" (Imame der Rechtsschulen)
alter table public.geschichten drop constraint if exists geschichten_bereich_check;
alter table public.geschichten add constraint geschichten_bereich_check check (bereich in ('anbiya','sahaba','tabiin','aimma','ahmad'));
