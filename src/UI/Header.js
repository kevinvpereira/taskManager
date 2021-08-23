import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../store/auth-context";
import classes from "./Header.module.css";

const Header = () => {
  const authContext = useContext(AuthContext);
  const isUserLoggedIn = authContext.isLoggedIn;

  const content = isUserLoggedIn ? (
    <li onClick={authContext.logout}>Logout</li>
  ) : (
    <NavLink to="/login">Login</NavLink>
  );

  return (
    <header className={classes.header}>
      <h1>Tasks</h1>
      <nav>
        <ul>{content}</ul>
      </nav>
    </header>
  );
};

export default Header;
