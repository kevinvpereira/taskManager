import React, { useCallback, useEffect, useState } from "react";

const initialAuthState = {
  token: null,
  email: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
};

export const AuthContext = React.createContext(initialAuthState);

const localStorageAuthenticationKey = "authentication";
const localStorageExpirationTimeKey = "expirationTime";
let logoutTimeout;

const calculateRemainingTime = (expirationTime) => {
  return new Date(expirationTime).getTime() - new Date().getTime();
};

const removeLocalStorageItems = () => {
  localStorage.removeItem(localStorageAuthenticationKey);
  localStorage.removeItem(localStorageExpirationTimeKey);
};

const getStoredAuthentication = () => {
  const expirationTime = localStorage.getItem(localStorageExpirationTimeKey);
  const auth = localStorage.getItem(localStorageAuthenticationKey);

  const storedAuthentication = {
    auth: initialAuthState,
    remainingTime: calculateRemainingTime(expirationTime),
  };

  if (auth && storedAuthentication.remainingTime > 36000) {
    storedAuthentication.auth = JSON.parse(auth);
    return storedAuthentication;
  }

  removeLocalStorageItems();
  return storedAuthentication;
};

export const AuthProvider = (props) => {
  const storedAuthentication = getStoredAuthentication();
  const [userAuth, setUserAuth] = useState(storedAuthentication.auth);
  const isUserLoggedIn = !!userAuth.token;

  const logoutHandler = useCallback(() => {
    removeLocalStorageItems();

    if (logoutTimeout) {
      clearTimeout(logoutTimeout);
    }

    setUserAuth(initialAuthState);
  }, []);

  const loginHandler = (userAuthentication) => {
    const newAuth = {
      token: userAuthentication.idToken,
      email: userAuthentication.email,
    };

    const expirationTime = new Date(
      new Date().getTime() + +userAuthentication.expiresIn * 1000
    );

    localStorage.setItem(
      localStorageExpirationTimeKey,
      expirationTime.toISOString()
    );
    localStorage.setItem(
      localStorageAuthenticationKey,
      JSON.stringify(newAuth)
    );

    logoutTimeout = setTimeout(
      logoutHandler,
      calculateRemainingTime(expirationTime.toISOString())
    );
    setUserAuth(newAuth);
  };

  useEffect(() => {
    if (storedAuthentication.auth && storedAuthentication.auth.token) {
      logoutTimeout = setTimeout(
        logoutHandler,
        storedAuthentication.remainingTime
      );
    }
  }, [storedAuthentication, logoutHandler]);

  const context = {
    token: userAuth.token,
    email: userAuth.email,
    isLoggedIn: isUserLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
