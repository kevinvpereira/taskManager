import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Tasks from "./Pages/Tasks";
import Login from "./Pages/Login";
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import Header from "./UI/Header";

function App() {
  const authContext = useContext(AuthContext);
  const isUserLoggedIn = authContext.isLoggedIn;

  return (
    <div className="App">
      {isUserLoggedIn && <Header/>}
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>

        {isUserLoggedIn && <Route path="/tasks">
          <Tasks />
        </Route>}

        <Route path="/login">
          <Login />
        </Route>

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
