import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();
export const SetUserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ user: null, loading: true });

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/api/current_user");
        setUser({ user: res.data, loading: false });
      } catch (error) {
        setUser({ user: null, loading: false });
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <SetUserContext.Provider value={setUser}>
        {children}
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
};
