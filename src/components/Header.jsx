import { Link } from "react-router-dom";
import Logo from "../images/header-logo.png";
import searchIcon from "../images/icons/searchIcon.png";
import { useAuth } from "../context/GlobalContext"; 
import shoppingCart from "../images/icons/shopping-cart.png";
import { auth } from "../firebase"; 
import "./header.css";

const Header = () => {
  // Appel du context de l'authentification pour récuprérer l'utilisateur connecté et le stocker dans le state de l'application //
  const { user } = useAuth();
  // Appel de la fonction de déconnexion de l'utilisateur via la méthode sign Out de firebase //
  const handleAuthentication = () => {
    auth.signOut(); 
  }
  // Retourne le composant Header avec les options de navigation //
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
              {/* Affichage de l'email de l'utilisateur connecté ou de "Guest" si l'utilisateur n'est pas connecté */}
              Hello {user ? `${user.email}` : "Guest"}
            </span>
            <span className="header-optionLineTwo">
              {/* Affichage de la fonction de déconnexion ou de connexion en fonction de l'état de l'utilisateur */}
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
