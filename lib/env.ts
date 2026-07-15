import { z } from "zod";

/**
 * Server-only secrets. Never import this module from a "use client" file —
 * Next.js will refuse to bundle it once real values are added, but we also
 * enforce it at runtime below as a defense-in-depth check.
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  N8N_WEBHOOK_SECRET: z.string().min(1, "N8N_WEBHOOK_SECRET is required"),
});

/** Public variables inlined into the browser bundle at build time. */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;
type ClientEnv = z.infer<typeof clientEnvSchema>;

let cachedServerEnv: ServerEnv | undefined;
let cachedClientEnv: ClientEnv | undefined;

function formatZodError(error: z.ZodError, kind: "server" | "client") {
  const issues = error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
  return (
    `Invalid ${kind} environment variables:\n${issues}\n\n` +
    "Copy .env.example to .env.local and fill in the missing values."
  );
}

/**
 * Lazily validates and returns server-only environment variables.
 * Throws a descriptive error the first time a feature that needs them
 * (Supabase admin client, OpenAI, Stripe, ...) is actually used — it does
 * NOT crash the app at import time, since most routes don't need every key.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must never be called from client-side code.");
  }
  if (!cachedServerEnv) {
    const parsed = serverEnvSchema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(formatZodError(parsed.error, "server"));
    }
    cachedServerEnv = parsed.data;
  }
  return cachedServerEnv;
}

/**
 * Lazily validates and returns the public environment variables consumed by
 * the browser (Supabase URL / anon key, app URL for OAuth callbacks, etc.).
 */
export function getClientEnv(): ClientEnv {
  if (!cachedClientEnv) {
    const parsed = clientEnvSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
    if (!parsed.success) {
      throw new Error(formatZodError(parsed.error, "client"));
    }
    cachedClientEnv = parsed.data;
  }
  return cachedClientEnv;
}
