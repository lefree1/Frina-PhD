# Instructions de déploiement sur Vercel

## Méthode 1 : Via l'interface web Vercel (Recommandée)

1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte GitHub (le même que pour `lefree1/Frina-PhD`)
3. Cliquez sur **"Add New..."** → **"Project"**
4. Dans la section "Import Git Repository", sélectionnez ou recherchez `lefree1/Frina-PhD`
5. Vercel détectera automatiquement Next.js. Les paramètres par défaut devraient être :
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Cliquez sur **"Deploy"**
7. Une fois le déploiement terminé, votre application sera disponible à l'URL fournie par Vercel
8. Pour utiliser le domaine `frina-phd.vercel.app` :
   - Allez dans **"Settings"** → **"Domains"**
   - Ajoutez ou modifiez le domaine si nécessaire

## Méthode 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI globalement (si ce n'est pas déjà fait)
npm install -g vercel

# OU utiliser npx (sans installation globale)
npx vercel

# Suivre les instructions interactives :
# - Login avec GitHub
# - Sélectionner le projet existant ou créer un nouveau
# - Configurer le projet
```

## Important : Configuration SQLite sur Vercel

L'application est déjà configurée pour fonctionner sur Vercel avec SQLite. 
La base de données sera initialisée automatiquement au premier démarrage depuis `data/thesis-data.json`.

**Note**: Sur Vercel (environnement serverless), la base de données SQLite utilise `/tmp` pour le stockage.
Les modifications persistantes peuvent nécessiter une migration vers une base de données externe (Vercel Postgres, Turso, etc.) pour une utilisation en production.

## Dépôt GitHub

Le code source est disponible sur : https://github.com/lefree1/Frina-PhD

