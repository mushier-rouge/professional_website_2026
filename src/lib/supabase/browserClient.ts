import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "./publicEnv";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (browserClient) return browserClient;

  const env = getSupabasePublicEnv();
  if (!env) return null;

  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}

