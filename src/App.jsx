import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import Orders from "./components/Orders";
import { auth } from "./firebase";
import { useAuth } from "./context/GlobalContext";

// Clé publique Stripe (à définir dans .env : VITE_STRIPE_PUBLISHABLE_KEY=pk_...)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");
function App() {
  // Appel du context de l'authentification pour récuprérer l'utilisateur connecté et le stocker dans le state de l'application //
  const { dispatch } = useAuth();
  // Utilisation de useEffect pour surveiller les changements d'état de l'authentification //
  useEffect(() => {
    // Fonction de surveillance des changements d'état de l'authentification //
    auth.onAuthStateChanged((authUser) => {
      // Si l'utilisateur est connecté, on dispatch l'action SET_USER avec l'utilisateur connecté //
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // Si l'utilisateur n'est pas connecté, on dispatch l'action SET_USER avec null //
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);
  // Retourne le composant App avec les routes de l'application //
  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header /> <Home /> <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/checkout"
          element={
            <>
              <Header />
              <Checkout />
            </>
          }
        />
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route
          path="/payment"
          element={
            <>
              <Header />
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Header />
              <Orders />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
