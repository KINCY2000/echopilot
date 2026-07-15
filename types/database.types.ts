/**
 * Placeholder Supabase database types.
 *
 * Real types will be generated from the schema in Module 2 ("Modèle de
 * données") with:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.types.ts
 *
 * Until then this keeps `createClient<Database>()` type-safe to call
 * without hard-coding a schema that doesn't exist yet.
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
