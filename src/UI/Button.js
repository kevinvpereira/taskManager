import classes from "./Button.module.css";

const Button = (props) => {
  const className = `${classes.button} ${props.className ?? ""}`;
  const type = props.type ?? "button";

  return (
    <button className={className} onClick={props.onClick} type={type}>
      {props.children}
    </button>
  );
};

export default Button;
