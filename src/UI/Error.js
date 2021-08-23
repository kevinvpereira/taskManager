import { useEffect, useState } from "react";
import classes from "./Error.module.css";

const Error = (props) => {
  const [isVisible, setIsVisible] = useState(false);
    
  useEffect(() => {
    if (props.error) {
      setIsVisible(true);
    }

    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, [props.error]);

  const content = isVisible ? (
    <div className={classes.error}>
      <div className={classes["error__item"]}>
        <span>Error</span>
        <h4>{props.error.message}</h4>
      </div>
    </div>
  ) : (
    <div></div>
  );

  return content;
};

export default Error;
