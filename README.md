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

## Ce qui fonctionne déjà (prototype visuel)

- Tableau de bord responsive (sidebar desktop + menu mobile en Sheet)
- Indicateurs de réputation, graphiques de tendance et de répartition
- Sélection d'un avis, analyse IA simulée, choix du ton, réponse générée simulée
- Bouton de publication simulé

## Roadmap

| Module | Statut |
|---|---|
| 1. Fondations techniques (shadcn/ui, structure, clients Supabase) | ✅ |
| 2. Modèle de données (schéma, migrations, RLS) | à venir |
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
