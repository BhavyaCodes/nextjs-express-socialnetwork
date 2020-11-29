import { useContext } from "react";
import { UserContext } from "../components/context/user.context";

const Navbar = () => {
  const user = useContext(UserContext);
  console.log(user);
  return (
    <div>
      Navbar
      {!user.loading && (
        <div>
          {user.user ? (
            <a href="/api/logout">Logout</a>
          ) : (
            <a href="/auth/google">Login</a>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
