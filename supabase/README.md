# Supabase einrichten (Tariq al-Din)

Ich (Claude) hatte in der Entwicklungsumgebung keinen Zugriff auf dein Supabase-Projekt. Das Schema habe ich deshalb
als SQL vorbereitet und lokal gegen eine Test-Postgres geprüft (Rollen, Freigabe-Schutz, Lesen/Schreiben). Gegen
echtes Supabase (Auth, Storage) ist es noch **nicht** gelaufen – bitte nach dem Einspielen kurz die Checkliste unten durchgehen.

## 1. Schema einspielen
Supabase → SQL Editor → Inhalt von `migrations/001_init.sql` einfügen und ausführen.

## 2. Team-Konto + Rolle
1. Authentication → Users → *Add user* (E-Mail + Passwort). Öffentliche Registrierung besser abschalten
   (Authentication → Providers → Email → „Allow new users to sign up“ aus), sonst kann jeder ein Konto anlegen.
2. Rolle vergeben (SQL Editor), `<UUID>` = ID des Users:
```sql
insert into public.rollen (user_id, rolle) values ('<UUID>', 'admin');   -- oder 'pruefer' / 'editor'
```
- **admin / pruefer**: dürfen Inhalte auf „geprüft“ setzen (fachkundige Person!).
- **editor**: bearbeitet Entwürfe, kann nicht freigeben. Änderungen an geprüften Inhalten setzen diese automatisch zurück auf „entwurf“.

## 3. App verbinden
`.env.local` anlegen (siehe `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (Settings → API → anon/public).
Den `service_role`-Key **nie** in die App oder ins Repo legen.

## 4. Admin benutzen
App öffnen und `#/admin` an die Adresse hängen → anmelden → „Beispiel Yusuf importieren“ (optional) → bearbeiten.

## Checkliste nach dem Einspielen
- [ ] Ohne Login: App zeigt nur Geschichten mit Status `geprüft` (Entwürfe nur mit `?entwurf=1` **und** nur, wenn die Datenbank sie liefert – für Anonyme tut sie das nicht).
- [ ] Editor kann speichern, aber nicht freigeben; Admin/Prüfer kann freigeben.
- [ ] Bild- und Audio-Upload im Admin funktioniert (Buckets `audio`, `bilder`).
