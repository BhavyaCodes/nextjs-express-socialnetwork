import {
  createContext,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import axios from "axios";

interface LoggedInUser {
  loading: boolean;
  user: {
    _id: string;
    googleId: string;
    imageUrl: string;
    name: string;
    posts: string[];
    likes: string[];
  } | null;
}

export const UserContext = createContext<LoggedInUser | undefined>(undefined);
export const SetUserContext = createContext<
  Dispatch<SetStateAction<LoggedInUser>> | undefined
>(undefined);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState<LoggedInUser>({ user: null, loading: true });

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
