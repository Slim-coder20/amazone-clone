import "./payment.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import { CardElement } from "@stripe/react-stripe-js";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "../context/AppReducer";

const Payment = () => {
  const { basket, user } = useAuth();
  // Fonction pour la soumission du formulaire du paiement // 
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
  }
  // Création de la fonction hnadleChange pour effectué le paiment en ligne //
  const handleChange = () => {};
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
                <button className="payment-details button" type="submit">
                  <span>Buy Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};;;

export default Payment;
