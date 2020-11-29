import { createContext, useReducer } from "react";
import reducer from "../reducers/user.reducer";

export const UserContext = createContext();
export const DispatchUserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { user: null });

  return (
    <UserContext.Provider value={state}>
      <DispatchUserContext.Provider value={dispatch}>
        {children}
      </DispatchUserContext.Provider>
    </UserContext.Provider>
  );
};
