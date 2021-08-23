import { Fragment, useRef, useState } from "react";
import Button from "../UI/Button";
import classes from "./Task.module.css";

const getStylesByType = (type) => {
  let styles;
  switch (type) {
    case "Doing":
      styles = {
        class: "task--doing",
        color: "blue",
        nextType: "Done",
      };
      break;
    case "Done":
      styles = {
        class: "task--done",
        color: "green",
        nextType: "Remove",
      };
      break;
    default:
      styles = {
        class: "task--todo",
        color: "red",
        nextType: "Doing",
      };
      break;
  }

  return styles;
};

const getStatusColor = (status) => {
  let color;

  switch (status) {
    case "Urgent":
      color = "red";
      break;
    case "Delayed":
      color = "yellow";
      break;
    default:
      color = "white";
      break;
  }

  return color;
};

const Task = (props) => {
  const [isEdit, setIsEdit] = useState(!props.name);
  const tagRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const dateRef = useRef();
  const statusRef = useRef();

  const styles = getStylesByType(props.type);
  const backStyles = { backgroundColor: styles.color };
  const statusStyle = { color: getStatusColor(props.status) };

  const editHandler = () => {
    setIsEdit((prevState) => !prevState);
  };

  const saveHandler = (event) => {
    event.preventDefault();

    const tag = tagRef.current.value;
    const name = titleRef.current.value;
    const description = descriptionRef.current.value;
    const date = dateRef.current.value;
    const status = statusRef.current.value;

    const task = {
      id: props.id,
      type: props.type,
      tag,
      name,
      description,
      date,
      status,
    };

    props.onSave(task);
  };

  const removeHandler = () => {
    props.onRemove(props.id);
  };

  const nextStepHandler = (event) => {
    event.stopPropagation();
    props.onNextStep(props.id, props.type);
  };

  const inputChangeHandler = (event) => event.stopPropagation();

  const headerContent = (
    <Fragment>
      <span>{props.tag}</span>
      <span style={statusStyle}>{props.status}</span>
    </Fragment>
  );

  const headerEditContent = (
    <Fragment>
      <input
        ref={tagRef}
        onClick={inputChangeHandler}
        defaultValue={props.tag}
        placeholder="tag"
      />
      <select
        ref={statusRef}
        defaultValue={props.status}
        onClick={inputChangeHandler}
        style={statusStyle}
      >
        <option>Urgent</option>
        <option>Delayed</option>
        <option>Normal</option>
      </select>
    </Fragment>
  );

  const footerContent = (
    <Fragment>
      <span>{props.date}</span>
      <span onClick={nextStepHandler} className={classes["task__step"]}>
        <div className={classes["task__arrow"]}>&rarr;</div>
        {styles.nextType}
      </span>
    </Fragment>
  );

  const footerEditContent = (
    <Fragment>
      <input
        ref={dateRef}
        defaultValue={props.date}
        onClick={inputChangeHandler}
        placeholder="When"
      />
      <span className={classes["task__actions"]}>
        <Button
          className={classes["task__actions--remove"]}
          onClick={removeHandler}
        >
          Remove
        </Button>
        <Button onClick={saveHandler}>Save</Button>
      </span>
    </Fragment>
  );

  return (
    <div className={classes["task-back"]} style={backStyles}>
      <div
        onClick={editHandler}
        className={`${classes.task} ${classes[styles.class]}`}
        style={{ backgroundSize: "cover" }}
      >
        <div className={classes["task__header"]}>
          <div className={classes["task__preheader"]}>
            {isEdit && headerEditContent}
            {!isEdit && headerContent}
          </div>
          <hr />
          {!isEdit && <h3>{props.name}</h3>}
          {isEdit && (
            <input
              ref={titleRef}
              onClick={inputChangeHandler}
              className={classes["task__title"]}
              defaultValue={props.name}
              placeholder="title"
            />
          )}
        </div>
        {props.description && !isEdit && <p>{props.description}</p>}
        {isEdit && (
          <textarea
            ref={descriptionRef}
            onClick={inputChangeHandler}
            defaultValue={props.description}
            placeholder="description"
          ></textarea>
        )}
        <div className={classes.status}>
          {!isEdit && footerContent}
          {isEdit && footerEditContent}
        </div>
      </div>
    </div>
  );
};

export default Task;
