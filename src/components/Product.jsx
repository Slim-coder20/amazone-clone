import { useAuth } from "../context/GlobalContext";
import starIcon from "../images/icons/star.png";
import "./product.css";

const Product = ({ id, image, price, title, rating }) => {

  const { dispatch, basket } = useAuth();

  // Fonction pour la soumission du bouton add to basket avec AppReducer pour ajouter l'article au panier //
  const addToBasket = () => {
    // Appel de la fonction dispatch pour ajouter l'article au panier avec AppReducer //
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
      },
    });
  };
  
   

  return (
    <div className="product">
      <div className="product-info">
        <p>{title}</p>
        <p className="product-price">
          <strong>
            {price} <small>€</small>
          </strong>
        </p>
      </div>
      <div className="product-rating">
        {/* Ouverture de la boucle pour afficher le nombre de étoiles en fonction de la note du produit */}
        {/* Affichage de l'étoile en fonction de la note du produit */}
        {Array(rating)
          .fill()
          .map((_, i) => (
            <p key={i}>
              <img src={starIcon} alt="starIcon" />
            </p>
          ))}
      </div>
      {/* Affichage de l'image du produit */}
      <img src={image} alt="product-img" />
      {/* Bouton d'ajout au panier */}
      <button onClick={addToBasket}>Add to basket</button>
    </div>
  );
  // Retourne le composant Product avec les informations du produit //
};
// Exportation du composant Product //

export default Product;
