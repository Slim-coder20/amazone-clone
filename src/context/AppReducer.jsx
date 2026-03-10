/**
 * AppReducer est un reducer qui permet de gérer l'état de l'application
 * et de les partager entre les composants 
 */
// Création de l'état initial de l'application //
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
    default:
      // Retourne l'état actuel de l'application si l'action n'est pas reconnue //
      return state;
  }
};

// Exportation du reducer //
export default AppReducer;
