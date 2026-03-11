import React from "react";
import { useAuth } from "../context/GlobalContext";
import checkoutImg from "../images/checkoutAd.jpg";
import CheckoutProduct from "./CheckoutProduct";
import Subtotal from "./Subtotal"; 
import "./checkout.css";

const Checkout = () => {
  const { user, basket } = useAuth();
  return (
    <div className="checkout">
      <div className="checkout-left">
        <img src={checkoutImg} className="checkout-ad" alt="checkoutimg" />

        <div>
          <small style={{ fontSize: "18px" }}>Hello {user?.email}</small>
          <h2 className="checkout-title">Your shopping Basket</h2>
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
      <div className="checkout-right">
        <Subtotal/>
      </div>
    </div>
  );
};

export default Checkout;
