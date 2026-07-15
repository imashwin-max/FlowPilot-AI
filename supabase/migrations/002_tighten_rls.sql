-- All reads/writes to workflow_requests and activity_logs happen exclusively
-- through this app's server-side API routes (using the service role key or
-- server-only anon key), never directly from the browser. The original
-- policies (`using (true)` / `with check (true)`) grant read+write to ANY
-- caller holding the anon key, which is broader than this app needs.
--
-- This migration drops the open policies. If you are not using the service
-- role key in `SUPABASE_SERVICE_ROLE_KEY`, do NOT run this migration - the
-- app will break, because the anon key path relies on these permissive
-- policies. Prefer setting SUPABASE_SERVICE_ROLE_KEY (server-only, never
-- shipped to the browser) and running this migration for a materially
-- tighter security posture before the demo.

drop policy if exists "workflow_requests_read_all" on workflow_requests;
drop policy if exists "workflow_requests_insert_all" on workflow_requests;
drop policy if exists "workflow_requests_update_all" on workflow_requests;
drop policy if exists "activity_logs_read_all" on activity_logs;
drop policy if exists "activity_logs_insert_all" on activity_logs;

-- With RLS enabled and no policies for the anon/authenticated roles, only
-- requests made with the service_role key (which bypasses RLS entirely)
-- can read or write these tables. That matches how this app actually talks
-- to Supabase (see lib/supabase.ts - createSupabaseServerClient).
