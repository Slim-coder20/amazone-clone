/**
 * AppReducer est un reducer qui permet de gérer l'état de l'application
 * et de les partager entre les composants 
 */
// Création de l'état initial de l'application //


// Fonction pour calculer le total du panier // 
export const getBasketTotal = (basket) => {
  return basket.reduce((amount, item) =>{
    return amount + item.price; 
  } , 0)

}
export const initialState = {
  basket: [],
  user: null,
};

// Création du reducer //
const AppReducer = (state = initialState, action) => {
// Switch pour gérer les actions //
  switch (action.type) {
    case "SET_USER":
      // Retourne le nouvel état de l'application avec l'utilisateur connecté //
      return {
        ...state,
        user: action.user,
      };
    case "ADD_TO_BASKET":
      // Retourne le nouvel état de l'application avec l'article ajouté au panier //
      return {
        ...state,
        basket: [...state.basket, action.item],
      };
    // Supprime tous le panier //
    case "EMPTY_BASKET":
      return {
        ...state,
        basket: [],
      };

    case "REMOVE_FROM_BASKET":
      // Supprime un produit du panier
      const index = state.basket?.findIndex(
        (basketItem) => basketItem.id === action.id,
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `can't remove product {id ${action.id} as it's not in basket!`,
        );
      }
      return {
        ...state,
        basket: newBasket,
      };
    default:
      // Retourne l'état actuel de l'application si l'action n'est pas reconnue //
      return state;
  }
};

// Exportation du reducer //
export default AppReducer;
