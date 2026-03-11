import CurrencyFormat from "react-currency-format";
import { useAuth } from "../context/GlobalContext";
import { getBasketTotal } from "../context/AppReducer";
import { useNavigate } from "react-router-dom";
import "./subtotal.css";

const Subtotal = () => {
  const { basket } = useAuth();
  const naviagte = useNavigate();
  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({basket.length} items): <strong>{value}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"€"}
      />
      <button onClick={() => naviagte("/payment")}>Proceed to Checkout</button>
    </div>
  );
};

export default Subtotal;
