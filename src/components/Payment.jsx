import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getBasketTotal } from "../context/AppReducer";
import axios from "./axios";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";
import "./payment.css";

const Payment = () => {
  const { basket, user, dispatch } = useAuth();
  const navigate = useNavigate();

  // State //
  const [clientSecret, setClientSecret] = useState();

  // State Error
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");

  // Ce sont des hooks de stripe pour permettre le paiement en ligne //
  const stripe = useStripe();
  const elements = useElements();

  // useEffect nous servira a ebvoyer notre requete de la somme total du panier vers le back //
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

  // Fonction pour la soumission du formulaire du paiement //
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setProcessing(true);
    setError(null);
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
  // Création de la fonction hnadleChange pour effectué le paiment en ligne //
  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };
  return (
    <div className="payment">
      <div className="payment-container">
        <h1>
          Checkout (<Link to="/checkout">{basket.length} items</Link>)
        </h1>
        {/* Delivery address section */}
        <div className="payment-section">
          <div className="payment-title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment-address">
            <p>{user?.email}</p>
            <p>Montrouge, France</p>
          </div>
        </div>
        {/* Review Items */}
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
        {/* Payment method  */}
        <div className="payment-section">
          <h3>Payment method</h3>
          <div className="payment-details">
            {/* Formulaire du paiement en ligne Stripe  */}
            <form onSubmit={handleSubmit}>
              {/* Stripe Card */}
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
