/**
 * =============================================================================
 * COMPOSANT PAYMENT – Page de paiement Stripe
 * =============================================================================
 *
 * Ce composant doit être rendu à l’intérieur d’un <Elements> (voir App.jsx)
 * pour que useStripe() et useElements() fonctionnent.
 *
 * Logique du flux de paiement :
 * 1. Au chargement : on demande au backend un clientSecret (Payment Intent Stripe).
 * 2. L’utilisateur remplit le formulaire carte (CardElement) et clique sur "Buy Now".
 * 3. On appelle stripe.confirmCardPayment(clientSecret, { card }) pour confirmer.
 * 4. Si succès : redirection vers /orders et vidage du panier.
 * 5. Si erreur : affichage du message d’erreur Stripe.
 *
 * =============================================================================
 */

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getBasketTotal } from "../context/AppReducer";
import axios from "./axios";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";
import "./payment.css";

const Payment = () => {
  // --- Contexte et navigation ---
  const { basket, user, dispatch } = useAuth();
  const navigate = useNavigate();

  // --- État lié au paiement Stripe ---
  const [clientSecret, setClientSecret] = useState();
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);   // true = champ carte vide ou invalide → bouton désactivé
  const [succeeded, setSucceeded] = useState(false); // paiement réussi
  const [processing, setProcessing] = useState("");  // en cours de traitement (affiche "Processing...")

  // Hooks Stripe : fournis par le provider <Elements> (App.jsx).
  // stripe = instance pour appeler l’API (ex. confirmCardPayment)
  // elements = conteneur des éléments de formulaire (ex. CardElement)
  const stripe = useStripe();
  const elements = useElements();

  // =========================================================================
  // Étape 1 : récupérer le clientSecret auprès du backend
  // =========================================================================
  // Le backend crée un Payment Intent Stripe et renvoie client_secret.
  // Ce secret permet au front de confirmer le paiement sans envoyer la carte au serveur.
  // Total envoyé en centimes (getBasketTotal en € × 100).
  useEffect(() => {
    const getClientSecret = async () => {
      const response = await axios({
        method: "POST",
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      setClientSecret(response.data.clientSecret);
      return response;
    };
    getClientSecret();
  }, [basket]);

  // =========================================================================
  // Soumission du formulaire : confirmer le paiement avec Stripe
  // =========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError(null);

    // confirmCardPayment : envoie les données carte à Stripe et confirme le Payment Intent.
    // Retourne { error } en cas d’échec, sinon le paiement est réussi.
    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    setSucceeded(true);
    setProcessing(false);
    navigate("/orders", { replace: true });
    dispatch({ type: "EMPTY_BASKET" });
  };

  // =========================================================================
  // Changement dans le champ carte (CardElement)
  // =========================================================================
  // e.empty = true si le champ est vide → on désactive le bouton.
  // e.error = erreur de validation Stripe (ex. numéro invalide) → on l’affiche.
  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  // =========================================================================
  // Rendu : adresse, récap panier, formulaire carte + total + bouton
  // =========================================================================
  return (
    <div className="payment">
      <div className="payment-container">
        <h1>
          Checkout (<Link to="/checkout">{basket.length} items</Link>)
        </h1>

        {/* Adresse de livraison (affichage) */}
        <div className="payment-section">
          <div className="payment-title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment-address">
            <p>{user?.email}</p>
            <p>Montrouge, France</p>
          </div>
        </div>

        {/* Récapitulatif des articles du panier */}
        <div className="payment-section">
          <div className="payment-title">
            <h3>Review Items and delivery</h3>
          </div>
          <div className="payment-items">
            {basket.map((item) => (
              <CheckoutProduct
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* Formulaire de paiement Stripe */}
        <div className="payment-section">
          <h3>Payment method</h3>
          <div className="payment-details">
            <form onSubmit={handleSubmit}>
              {/* Champ carte Stripe (numéro, date, CVC) – les données ne passent jamais par notre serveur */}
              <CardElement onChange={handleChange} />
              <div className="payment-priceContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total : {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"€"}
                />
                <button
                  className="payment-details button"
                  type="submit"
                  disabled={processing || disabled || succeeded}
                >
                  <span>{processing ? "Processing..." : "Buy Now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
