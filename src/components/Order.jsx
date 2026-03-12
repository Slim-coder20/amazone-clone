/**
 * =============================================================================
 * COMPOSANT ORDER – Carte d'une seule commande
 * =============================================================================
 *
 * Rôle : afficher le détail d'une commande (date, id, articles, total).
 * Reçoit en prop un objet order : { id, data } où data contient les champs
 * enregistrés dans Firestore par Payment.jsx (basket, amount, createdAt, paymentIntentId).
 *
 * Logique :
 * 1. Formater la date createdAt (Firestore Timestamp → chaîne lisible).
 * 2. Afficher l'id de la commande.
 * 3. Boucler sur order.data.basket pour afficher chaque article via CheckoutProduct.
 * 4. Afficher le total avec CurrencyFormat (amount déjà en euros, format européen).
 *
 * =============================================================================
 */

import React from "react";
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";
import "./order.css";

const Order = ({ order }) => {
  // --- Formatage de la date de commande ---
  // Firestore stocke createdAt comme Timestamp (objet avec .toDate() ou .seconds).
  // On ne peut pas passer l'objet directement à moment.unix() → "Invalid date".
  const createdAt = order?.data?.createdAt;
  const dateDisplay = createdAt?.toDate
    ? moment(createdAt.toDate()).format("MMMM Do YYYY, h:mm A")
    : createdAt?.seconds
      ? moment.unix(createdAt.seconds).format("MMMM Do YYYY, h:mm A")
      : "—";

  return (
    <div className="order">
      <h2>Order</h2>
      <p>{dateDisplay}</p>
      <p className="order-id">
        <small>{order.id}</small>
      </p>

      {/* Liste des articles de la commande (même structure que le panier au moment du paiement) */}
      {order.data.basket?.map((item) => (
        <CheckoutProduct
          key={item.id}
          id={item.id}
          title={item.title}
          image={item.image}
          price={item.price}
          rating={item.rating}
          hiddenButton
        />
      ))}

      {/* Total : amount est déjà en euros en base, pas de * 100. Format EU : virgule pour décimales, espace pour milliers */}
      <CurrencyFormat
        renderText={(value) => (
          <>
            <h3 className="order-total">Order Total: {value}</h3>
          </>
        )}
        decimalScale={2}
        value={order.data.amount}
        displayType={"text"}
        thousandSeparator={" "}
        decimalSeparator={","}
        prefix={"€ "}
      />
    </div>
  );
};

export default Order;
