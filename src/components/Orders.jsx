/**
 * =============================================================================
 * COMPOSANT ORDERS – Page "Vos commandes"
 * =============================================================================
 *
 * Rôle : afficher la liste de toutes les commandes de l'utilisateur connecté.
 * Les commandes sont enregistrées dans Firestore au moment du paiement (Payment.jsx)
 * dans la collection : users/{uid}/orders/{orderId}
 *
 * Logique :
 * 1. Récupérer l'utilisateur connecté (useAuth).
 * 2. S'abonner en temps réel (onSnapshot) à la sous-collection "orders" de l'utilisateur.
 * 3. Trier les commandes par date de création décroissante (createdAt).
 * 4. Pour chaque commande, rendre un composant Order avec les données.
 *
 * =============================================================================
 */

import "./orders.css";
import Order from "./Order";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "../context/GlobalContext";
import { db } from "../firebase";
import { useState, useEffect } from "react";

const Orders = () => {
  // Liste des commandes : chaque élément a { id, data } (data = basket, amount, createdAt, etc.)
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  // Abonnement Firestore : écoute en temps réel la sous-collection orders de l'utilisateur
  useEffect(() => {
    if (user) {
      // Référence : users/{uid}/orders
      const collRef = collection(db, "users", user?.uid, "orders");
      // Requête triée par createdAt décroissant (les plus récentes en premier)
      const orderedRef = query(collRef, orderBy("createdAt", "desc"));

      // onSnapshot : callback appelé à chaque changement (ajout, modif, suppression)
      // Pas besoin de refetch manuel : la liste se met à jour automatiquement
      const unsubscribe = onSnapshot(orderedRef, (querySnapshot) => {
        setOrders(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          })),
        );
      });

      // Nettoyage : désabonnement quand le composant est démonté ou que user change
      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      <div className="orders-order">
        {orders?.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
