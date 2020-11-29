import { useEffect } from "react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { UserContextProvider } from "../components/context/user.context";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Navbar />
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;
