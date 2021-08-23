import { useContext, useRef, useState } from "react";
import AuthApi, { AuthApiKey } from "../services/Auth-api";
import { useHistory } from "react-router-dom";
import AuthContext from "../store/auth-context";
import classes from "./Login.module.css";
import Button from "../UI/Button";

const Login = () => {
  const authContext = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();

  const switchModuleHandler = () => setIsLogin((prevState) => !prevState);

  const submitHandler = async (event) => {
    event.preventDefault();

    const authData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      returnSecureToken: true,
    };

    const authUrl = isLogin ? "signInWithPassword" : "signUp";

    const response = await AuthApi.post(
      `:${authUrl}?key=${AuthApiKey}`,
      authData
    );

    if (response.status === 200) {
      authContext.login(response.data);
      history.replace("/tasks");
    }

    //handle errors
  };

  return (
    <div className={classes.login}>
      <div className={classes["login-area"]}>
        <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={submitHandler}>
          <div className={classes["form-control"]}>
            <label htmlFor="email">Email</label>
            <input ref={emailRef} id="email" type="email" />
          </div>

          <div className={classes["form-control"]}>
            <label htmlFor="password">Password</label>
            <input ref={passwordRef} id="password" type="password" />
          </div>

          <span>
            {!isLogin ? "Have an Account? " : "Not registered Yet? "}
            <button type="button" onClick={switchModuleHandler}>
              {!isLogin ? "Login now" : "Create an account now"}
            </button>
          </span>

          <Button type="submit" className={classes.button}>
           {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </div>
      <div className={classes["login-highlight"]}>
        <h1>Join the task master</h1>
      </div>
    </div>
  );
};

export default Login;
