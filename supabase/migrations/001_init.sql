-- Tariq al-Din: Schema, Rollen und Sicherheitsregeln (RLS)
-- Im Supabase SQL-Editor ausführen. Idempotent angelegt, wo möglich.

-- ---------- Rollen ----------
-- admin   : alles, inkl. Rollen vergeben
-- pruefer : darf Inhalte auf "geprüft" setzen (fachkundige Person)
-- editor  : darf Entwürfe anlegen/bearbeiten, aber NICHT freigeben
create table if not exists public.rollen (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rolle   text not null check (rolle in ('admin','pruefer','editor')),
  created_at timestamptz not null default now()
);

create or replace function public.rolle() returns text
language sql stable security definer set search_path = public as
$$ select rolle from public.rollen where user_id = auth.uid() $$;

create or replace function public.ist_team() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.rollen where user_id = auth.uid()) $$;

create or replace function public.darf_freigeben() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.rollen where user_id = auth.uid() and rolle in ('admin','pruefer')) $$;

-- ---------- Inhalte ----------
create table if not exists public.geschichten (
  id          text primary key,
  bereich     text not null check (bereich in ('anbiya','sahaba','tabiin','ahmad')),
  titel_ar    text not null,
  titel_de    text not null,
  bild_url    text,
  bild_motiv  text not null default '',
  quellen     jsonb not null default '[]',   -- [{werk, stelle, einstufung?, platzhalter?}]
  zitate      jsonb not null default '{}',   -- {id: Zitat}
  hinweis     text,
  status      text not null default 'entwurf' check (status in ('entwurf','geprüft')),
  geprueft_von uuid references auth.users(id),
  geprueft_am  timestamptz,
  updated_at  timestamptz not null default now()
);

create table if not exists public.fassungen (
  geschichte_id   text not null references public.geschichten(id) on delete cascade,
  niveau          text not null check (niveau in ('klassisch','A1','A2','B1','B2','C1','C2')),
  status          text not null default 'entwurf' check (status in ('entwurf','geprüft')),
  hinweis         text,
  audio_platzhalter boolean not null default false,
  saetze          jsonb not null default '[]', -- [{id, text_ar_mit_harakat, text_de, audio_url?, wort_zeitstempel?, woerter?, zitat_id?, zitat_nach?}]
  schluss_zitate  jsonb not null default '[]',
  geprueft_von    uuid references auth.users(id),
  geprueft_am     timestamptz,
  updated_at      timestamptz not null default now(),
  primary key (geschichte_id, niveau)
);

create table if not exists public.quiz (
  geschichte_id text not null references public.geschichten(id) on delete cascade,
  niveau        text not null,
  status        text not null default 'entwurf' check (status in ('entwurf','geprüft')),
  fragen        jsonb not null default '[]',
  updated_at    timestamptz not null default now(),
  primary key (geschichte_id, niveau)
);

-- Nutzerdaten (Sync zwischen Geräten)
create table if not exists public.nutzer_daten (
  user_id uuid primary key references auth.users(id) on delete cascade,
  vokabeln jsonb not null default '[]',
  fortschritt jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ---------- Freigabe-Schutz ----------
-- Nur admin/pruefer dürfen "geprüft" setzen. Wird ein geprüfter Inhalt von einem Editor
-- geändert, fällt er automatisch auf "entwurf" zurück (kein unbemerktes Ändern geprüfter Texte).
create or replace function public.schutz_status() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.darf_freigeben() then
    if new.status = 'geprüft' and (tg_op = 'INSERT' or old.status is distinct from 'geprüft') then
      new.geprueft_von := auth.uid(); new.geprueft_am := now();
    end if;
  else
    if tg_op = 'INSERT' then
      new.status := 'entwurf';
    elsif old.status = 'geprüft' then
      new.status := 'entwurf';            -- Änderung durch Editor entzieht die Freigabe
    else
      new.status := 'entwurf';
    end if;
    new.geprueft_von := case when tg_op = 'UPDATE' then old.geprueft_von end;
    new.geprueft_am  := case when tg_op = 'UPDATE' then old.geprueft_am end;
  end if;
  new.updated_at := now();
  return new;
end $$;

do $$ declare t text; begin
  foreach t in array array['geschichten','fassungen','quiz'] loop
    execute format('drop trigger if exists trg_schutz on public.%I', t);
    execute format('create trigger trg_schutz before insert or update on public.%I for each row execute function public.schutz_status()', t);
  end loop;
end $$;

-- ---------- Row Level Security ----------
alter table public.rollen       enable row level security;
alter table public.geschichten  enable row level security;
alter table public.fassungen    enable row level security;
alter table public.quiz         enable row level security;
alter table public.nutzer_daten enable row level security;

-- Öffentlich lesbar: nur geprüfte Inhalte. Team sieht alles.
create policy "geschichten lesen"  on public.geschichten for select using (status = 'geprüft' or public.ist_team());
create policy "fassungen lesen"    on public.fassungen   for select using ((status = 'geprüft' and exists (select 1 from public.geschichten g where g.id = geschichte_id and g.status = 'geprüft')) or public.ist_team());
create policy "quiz lesen"         on public.quiz        for select using ((status = 'geprüft' and exists (select 1 from public.geschichten g where g.id = geschichte_id and g.status = 'geprüft')) or public.ist_team());

create policy "geschichten schreiben" on public.geschichten for all using (public.ist_team()) with check (public.ist_team());
create policy "fassungen schreiben"   on public.fassungen   for all using (public.ist_team()) with check (public.ist_team());
create policy "quiz schreiben"        on public.quiz        for all using (public.ist_team()) with check (public.ist_team());

-- Rollen: jeder sieht nur die eigene; vergeben nur über SQL-Editor/Service-Key (siehe README)
create policy "eigene rolle lesen" on public.rollen for select using (user_id = auth.uid());

create policy "nutzerdaten eigene" on public.nutzer_daten for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Storage (Audio & Bilder) ----------
insert into storage.buckets (id, name, public) values ('audio','audio',true), ('bilder','bilder',true)
  on conflict (id) do nothing;
create policy "audio/bilder lesen"     on storage.objects for select using (bucket_id in ('audio','bilder'));
create policy "audio/bilder schreiben" on storage.objects for insert with check (bucket_id in ('audio','bilder') and public.ist_team());
create policy "audio/bilder ändern"    on storage.objects for update using (bucket_id in ('audio','bilder') and public.ist_team());
create policy "audio/bilder löschen"   on storage.objects for delete using (bucket_id in ('audio','bilder') and public.ist_team());
