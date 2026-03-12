# Amazone-clone

Application web e-commerce inspirée d’Amazon : authentification Firebase, panier, checkout et paiement en ligne via Stripe.

---

## Table des matières

1. [Stack technique](#stack-technique)
2. [Pré-requis](#pré-requis)
3. [Installation et démarrage](#installation-et-démarrage)
4. [Variables d'environnement](#variables-denvironnement)
5. [Comptes de test](#comptes-de-test)
6. [Documentation](#documentation)

---

## Stack technique

| Partie | Technologies |
|--------|--------------|
| **Frontend** | React 19, Vite 7, React Router 7 |
| **UI / Données** | React Context (panier, auth), Axios |
| **Auth & Backend** | Firebase (Authentication), Cloud Functions |
| **Paiement** | Stripe (Payment Intents, Stripe.js + Elements) |

- **Frontend** : SPA avec Vite ; routes Home, Login, Checkout, Payment, Orders.
- **Backend** : API Express dans Firebase Functions (route `POST /payments/create` pour créer un Payment Intent Stripe).

---

## Pré-requis

- **Node.js** 18+ (recommandé 24 pour les Cloud Functions)
- **npm** ou **yarn**
- Un projet **Firebase** (Authentication activée)
- Un compte **Stripe** (mode test pour le développement)
- **Firebase CLI** : `npm install -g firebase-tools` puis `firebase login`

---

## Installation et démarrage

### 1. Cloner et installer les dépendances

```bash
git clone <url-du-repo>
cd amazone-clone
npm install
```

### 2. Backend (Firebase Functions)

```bash
cd functions
npm install
```

Crée un fichier `functions/.env` avec ta clé secrète Stripe (voir [Variables d'environnement](#variables-denvironnement)).

Pour lancer l’API en local (émulateur) :

```bash
npm run serve
# ou depuis la racine : firebase emulators:start --only functions
```

L’API sera disponible à : `http://127.0.0.1:5001/e-clone-f1b94/us-central1/api`

### 3. Frontend

À la racine du projet, crée un fichier `.env` avec les variables Firebase et Stripe (voir section suivante), puis :

```bash
npm run dev
```

L’app sera disponible sur `http://localhost:5173` (ou le port indiqué par Vite).

### 4. Déploiement (optionnel)

- **Frontend** : build `npm run build`, puis hébergement sur Firebase Hosting, Vercel, etc.
- **Backend** : `cd functions && npm run deploy` (configure d’abord le projet Firebase avec `firebase use`).

---

## Variables d'environnement

### À la racine du projet (frontend – Vite)

Fichier **`.env`** (ne pas commiter, déjà dans `.gitignore`) :

```env
# Firebase
VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
VITE_MEASUREMENT_ID=...

# Stripe (clé PUBLIQUE uniquement, pk_test_...)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Tu récupères les variables Firebase dans la console Firebase → Paramètres du projet → Général → « Tes apps » (config Web). La clé Stripe est dans le [tableau de bord Stripe](https://dashboard.stripe.com/apikeys) (clé publique « Clé à publier »).

### Dans le dossier `functions` (backend)

Fichier **`functions/.env`** (ne pas commiter) :

```env
STRIPE_SECRET_KEY=sk_test_...
```

Cette clé est la **clé secrète** Stripe (« Clé secrète » dans le dashboard). Elle ne doit **jamais** être utilisée ou exposée côté frontend.

---

## Comptes de test

### Stripe

En mode test, utilise les [cartes de test Stripe](https://stripe.com/docs/testing#cards), par exemple :

- **Paiement réussi** : `4242 4242 4242 4242`
- **Paiement refusé** : `4000 0000 0000 0002`
- Date d’expiration : n’importe quelle date future (ex. 12/34)
- CVC : 3 chiffres (ex. 123)

### Firebase

Utilise des comptes créés via l’écran Login de l’app (email/mot de passe) ou configure d’autres méthodes (Google, etc.) dans la console Firebase → Authentication.

---

## Documentation

- **Stripe** : [Documentation Stripe](https://stripe.com/docs), [Payment Intents](https://stripe.com/docs/payments/payment-intents), [Stripe.js / Elements](https://stripe.com/docs/stripe-js/react)
- **Firebase** : [Authentication](https://firebase.google.com/docs/auth), [Cloud Functions](https://firebase.google.com/docs/functions)
- **Vite** : [Guide Vite](https://vitejs.dev/guide/)
- **React** : [Documentation React](https://react.dev/)

Dans le projet, la logique du paiement est commentée dans :

- `src/components/Payment.jsx` — flux côté frontend (clientSecret, confirmCardPayment, redirection)
- `functions/index.js` — API et création du Payment Intent côté backend
