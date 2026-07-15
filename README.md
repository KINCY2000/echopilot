# EchoPilot

**Votre réputation, pilotée par l'IA.**

SaaS de gestion de réputation en ligne : connexion Google Business Profile, analyse IA des avis, génération de réponses personnalisées, statistiques et recommandations.

## Stack technique

- **Frontend** : Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui
- **Backend** : Next.js API Routes / Server Actions
- **Base de données & Auth** : Supabase (PostgreSQL, Auth, RLS)
- **Paiement** : Stripe Billing
- **IA** : OpenAI API
- **Emails** : Resend
- **Automatisation** : n8n
- **Déploiement** : Vercel

## Installation

1. Node.js 20.9+
2. `npm install`
3. `cp .env.example .env.local` puis renseigner les variables (voir ci-dessous)
4. `npm run dev` → http://localhost:3000

## Architecture

```
app/                      Routes Next.js (App Router) — restent fines, délèguent aux features
components/ui/            Primitives shadcn/ui (Button, Card, Select, Sheet, ...) — génériques, sans logique métier
features/<nom>/           Un dossier par fonctionnalité métier (ex: dashboard)
  components/              Composants React propres à la feature
  data/                    Données (mock aujourd'hui, requêtes Supabase plus tard)
  hooks/                   Hooks React propres à la feature
  types.ts                 Types TypeScript de la feature
lib/
  supabase/                 Clients Supabase (browser, server, admin — voir ci-dessous)
  env.ts                    Validation Zod des variables d'environnement (lazy, ne casse pas le build si non utilisées)
  utils.ts                  Helpers partagés (cn, ...)
types/                     Types partagés inter-features (ex: database.types.ts généré par Supabase)
```

Principe : chaque fonctionnalité (`features/*`) est autonome et ne dépend que de `components/ui` et `lib`. Aucune logique métier dans `app/` ou `components/ui/`.

### Clients Supabase

- `lib/supabase/client.ts` — Client Components (`"use client"`)
- `lib/supabase/server.ts` — Server Components / Server Actions / Route Handlers (gère les cookies de session)
- `lib/supabase/admin.ts` — Service role, contourne les RLS. **Jamais** exposé au navigateur, réservé aux webhooks et tâches serveur de confiance.

## Variables d'environnement

Voir `.env.example` pour la liste complète et leur module d'origine. Aucune clé API n'est utilisée côté client, sauf les variables `NEXT_PUBLIC_*` (URL et clé anonyme Supabase), qui sont conçues pour être publiques.

## Modèle de données (Supabase)

Les migrations SQL vivent dans `supabase/migrations/`, appliquées dans l'ordre de leur préfixe horodaté :

| Fichier | Contenu |
|---|---|
| `..._helper_functions.sql` | Trigger générique `set_updated_at` |
| `..._organizations_and_members.sql` | `organizations`, `profiles`, `organization_members`, RPC `create_organization`, helpers RLS (`private.*`) |
| `..._google_and_businesses.sql` | `google_connections` (tokens chiffrés côté app avant stockage), `businesses` |
| `..._reviews_and_ai_responses.sql` | `reviews` (+ champs d'analyse IA), `ai_responses` (une seule réponse publiée par avis, contrainte d'index) |
| `..._billing_notifications_audit.sql` | `subscriptions`, `notifications`, `ai_recommendations`, `audit_logs` |
| `..._rls_policies.sql` | RLS activée sur toutes les tables, scoping multi-tenant par organisation |
| `..._grants.sql` | `GRANT` explicites au rôle `authenticated` (nécessaires en plus des policies RLS — voir note ci-dessous) |

**Principe multi-tenant** : chaque ligne appartient (directement ou via une table parente) à une `organization`. Les policies RLS utilisent des fonctions `SECURITY DEFINER` dans le schéma `private` (`is_organization_member`, `is_organization_admin`) pour éviter la récursion RLS sur `organization_members` elle-même. Les tables alimentées uniquement côté serveur (sync Google, webhooks Stripe, logs d'audit) n'ont aucune policy INSERT/UPDATE/DELETE pour `authenticated` : elles ne sont modifiables que via `lib/supabase/admin.ts` (service role, contourne RLS).

⚠️ **Grants explicites requis** : les projets Supabase récents n'exposent plus automatiquement les nouvelles tables aux rôles `anon`/`authenticated` (voir le commentaire `auto_expose_new_tables` dans `supabase/config.toml`). Les policies RLS seules ne suffisent donc pas — `..._grants.sql` accorde explicitement les privilèges nécessaires.

**Validation** : en l'absence d'accès Docker dans cet environnement (`supabase start` / `supabase gen types --db-url` en ont besoin), les migrations ont été vérifiées par une exécution réelle sur un PostgreSQL 16 local : application de toutes les migrations sans erreur, puis un scénario à 3 utilisateurs/2 organisations confirmant l'isolation multi-tenant (un utilisateur ne voit jamais les données d'une autre organisation), les restrictions par rôle (un simple membre ne peut pas connecter un compte Google), et les contraintes (une seule réponse publiée par avis). `types/database.types.ts` a été écrit à la main à partir de ce schéma validé (introspection `information_schema`) ; à régénérer via `npx supabase gen types typescript --project-id <ref>` dès qu'un vrai projet Supabase existe.

## Ce qui fonctionne déjà (prototype visuel)

- Tableau de bord responsive (sidebar desktop + menu mobile en Sheet)
- Indicateurs de réputation, graphiques de tendance et de répartition
- Sélection d'un avis, analyse IA simulée, choix du ton, réponse générée simulée
- Bouton de publication simulé

## Roadmap

| Module | Statut |
|---|---|
| 1. Fondations techniques (shadcn/ui, structure, clients Supabase) | ✅ |
| 2. Modèle de données (schéma, migrations, RLS) | ✅ |
| 3. Authentification (Supabase Auth, multi-tenant) | à venir |
| 4. Intégration Google Business Profile (OAuth, sync) | à venir |
| 5. Moteur IA d'analyse (sentiment, thèmes, urgence) | à venir |
| 6. Génération de réponse IA + publication | à venir |
| 7. Dashboard branché aux données réelles | à venir |
| 8. Statistiques & recommandations IA | à venir |
| 9. Stripe Billing | à venir |
| 10. Emails transactionnels (Resend) | à venir |
| 11. Automatisations n8n | à venir |
| 12. Durcissement sécurité transverse | à venir |
| 13. Déploiement Vercel + CI | à venir |
