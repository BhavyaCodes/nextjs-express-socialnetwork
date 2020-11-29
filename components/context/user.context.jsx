import { createContext, useState } from "react";

export const UserContext = createContext();
export const SetUserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [state, setState] = useState({ user: null });

  return (
    <UserContext.Provider value={state}>
      <SetUserContext.Provider value={setState}>
        {children}
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
};
