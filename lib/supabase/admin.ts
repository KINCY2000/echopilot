import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getClientEnv, getServerEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Privileged Supabase client using the service role key — bypasses Row
 * Level Security. Reserved for trusted server-only operations (Stripe
 * webhooks, Google/n8n sync jobs, admin scripts). Never expose this client
 * or its key to the browser.
 */
export function createAdminClient() {
  const clientEnv = getClientEnv();
  const serverEnv = getServerEnv();

  return createSupabaseClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
