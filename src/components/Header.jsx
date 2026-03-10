import { Link } from "react-router-dom";
import Logo from "../images/header-logo.png";
import searchIcon from "../images/icons/searchIcon.png";
import { useAuth } from "../context/GlobalContext"; 
import shoppingCart from "../images/icons/shopping-cart.png";
import { auth } from "../firebase"; 
import "./header.css";

const Header = () => {
  const { user } = useAuth();

  // Création de la fonction de l'authentification pour la déconnexion du User via la méthode sign Out de firebase // 
  const handleAuthentication = () => {
    auth.signOut(); 
  }
  return (
    <div className="header">
      <Link to="/">
        <img src={Logo} className="header-logo" alt="logo" />
      </Link>
      <div className="header-search">
        <input type="text" className="header-searchInput" />
        <img
          className="header-searchIcon"
          src={searchIcon}
          alt="search-icon"
          width="20px"
          height="20px"
        />
      </div>
      <div className="header-nav">
        {/* Menu de connexion */}
        <Link to={!user && "/login"}>
          <div className="header-option" onClick={handleAuthentication}>
            <span className="header-optionLineOne">
              Hello {user ? `${user.email}` : "Guest"}
            </span>
            <span className="header-optionLineTwo">
              {user ? "Sign Out" : "Sign In"}
            </span>
          </div>
        </Link>
        {/* Menu pour commande */}
        <Link to="/orders">
          <div className="header-option">
            <div className="header-optionLineOne">Returns</div>
            <div className="header-optionLineTwo">& Orders</div>
          </div>
        </Link>
        <div className="header-option">
          <div className="header-optionLineOne">Your</div>
          <div className="header-optionLineTwo">Prime</div>
        </div>
        {/* Menu du Panier  */}
        <Link to="/checkout">
          <div className="header-optionBasket">
            <img
              src={shoppingCart}
              alt="shoppingCart"
              width="20px"
              height="20px"
            />
            <span className="header-optionLineTwo header-basketCount">5</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
