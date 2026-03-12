// =============================================================================
// BACKEND API – Firebase Cloud Functions + Express + Stripe
// =============================================================================
// Ce fichier expose une API HTTP pour l’application (notamment la création
// d’un Payment Intent Stripe). Il tourne dans l’émulateur (local) ou en prod.
// =============================================================================

// Charger les variables d'environnement depuis le fichier functions/.env
// Sans cela, process.env.STRIPE_SECRET_KEY serait undefined au démarrage
// et Stripe renverrait "Neither apiKey nor config.authenticator provided"
require("dotenv").config();

// --- Imports Firebase et serveur ---
const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https"); // pour exposer l’app Express en HTTP
const express = require("express");
const cors = require("cors");

// Initialisation du client Stripe avec la clé secrète (sk_test_... ou sk_live_...)
// Cette clé ne doit jamais être exposée côté frontend, uniquement ici côté serveur
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// --- Configuration de l’application Express ---
const app = express();

// CORS : autoriser les requêtes depuis le frontend (origine différente, ex. localhost:5173)
// { origin: true } accepte toute origine ; en prod tu peux restreindre à ton domaine
app.use(cors({ origin: true }));

// Parser le corps des requêtes en JSON (pour les futurs POST avec body JSON)
app.use(express.json());

// --- Middleware : normalisation du chemin d’URL (émulateur Firebase) ---
// En local, l’émulateur envoie des URLs du type :
//   /e-clone-f1b94/us-central1/api/payments/create
// Express ne connaît que la route "/payments/create". On réécrit req.url pour
// ne garder que la partie après "/api", afin que app.post("/payments/create") matche.
// En production (Cloud Functions déployées), le path reçu est déjà du type /payments/create.
app.use((req, res, next) => {
  const path = (req.path || req.url).split("?")[0];
  const query = (req.url && req.url.includes("?")) ? "?" + req.url.split("?")[1] : "";
  const i = path.indexOf("/api");
  if (i !== -1) {
    const afterApi = path.slice(i + 4) || "/"; // tout ce qui suit "/api"
    req.url = afterApi + query;
  }
  next();
});

// =============================================================================
// ROUTES API
// =============================================================================

// Route de test : GET / ou GET /api → "hello World" (pour vérifier que l’API répond)
app.get("/", (req, res) => res.status(200).send("hello World"));

// Création d’un Payment Intent Stripe (étape 1 du paiement côté serveur)
// Le frontend envoie le total en centimes en query : ?total=1999 (19,99 €)
app.post("/payments/create", async (req, res) => {
  // Total en centimes (entier), arrondi pour éviter les décimales
  const total = Math.round(Number(req.query.total)) || 0;
  if (total <= 0) {
    return res.status(400).json({ error: "Total invalide" });
  }

  // Créer le Payment Intent chez Stripe ; le client secret est renvoyé au front
  // pour que Stripe.js puisse confirmer le paiement (confirmCardPayment) sans
  // que la carte ne transite par notre serveur (PCI compliant)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "eur",
  });

  res.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// =============================================================================
// EXPORT FIREBASE
// =============================================================================
// URL de l’API (émulateur) : http://127.0.0.1:5001/e-clone-f1b94/us-central1/api
// Le frontend appelle par ex. : POST .../api/payments/create?total=1999

exports.api = onRequest(app);

// Option : limiter le nombre d’instances en prod pour maîtriser les coûts
setGlobalOptions({ maxInstances: 10 });
