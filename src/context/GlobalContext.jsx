import { createContext, useReducer, useContext } from "react";
import AppReducer from "./AppReducer";
import { initialState } from "./AppReducer";

/**
 * GlobalContext est un contexte global qui permet de stocker les données de l'application
 * et de les partager entre les composants 
 */

// Création du contexte global //
const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // Utilisation de useReducer pour gérer l'état de l'application //
  const [state, dispatch] = useReducer(AppReducer, initialState);
  // Retourne le composant GlobalProvider avec les données de l'application //
  return (
    <GlobalContext.Provider
      value={{ basket: state.basket, user: state.user, dispatch: dispatch }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Exportation du composant GlobalProvider //
export default GlobalProvider;

// Création du hook useAuth //
export const useAuth = () => {
// Retourne le contexte global pour pouvoir utiliser les données de l'application dans les composants //
  return useContext(GlobalContext);
};
