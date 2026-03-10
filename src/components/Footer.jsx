import { Link } from "react-router-dom";
import Logo from "../images/header-logo.png";
import shoppingCart from "../images/icons/shopping-cart.png";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Link to="/" className="footer-logoLink">
        <img src={Logo} className="footer-logo" alt="logo" />
      </Link>
      <div className="footer-nav">
        <Link to="/login">
          <div className="footer-option">
            <span className="footer-optionLineOne">Hello Guest</span>
            <span className="footer-optionLineTwo">Sign In</span>
          </div>
        </Link>
        <Link to="/orders">
          <div className="footer-option">
            <span className="footer-optionLineOne">Returns</span>
            <span className="footer-optionLineTwo">& Orders</span>
          </div>
        </Link>
        <div className="footer-option">
          <span className="footer-optionLineOne">Your</span>
          <span className="footer-optionLineTwo">Prime</span>
        </div>
        <Link to="/checkout">
          <div className="footer-optionBasket">
            <img
              src={shoppingCart}
              alt="shoppingCart"
              width="20px"
              height="20px"
            />
            <span className="footer-optionLineTwo footer-basketCount">Cart</span>
          </div>
        </Link>
      </div>
      <div className="footer-bottom">
        <span className="footer-copyright">
          © {new Date().getFullYear()} Amazon Clone. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
