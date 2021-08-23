import { CSSTransition, TransitionGroup } from "react-transition-group";
import Button from "../UI/Button";
import Task from "./Task";
import classes from "./TaskList.module.css";

const TaskList = (props) => {
  const addHandler = async () => {
    const task = {
      id: new Date().toISOString(),
      status: "Normal",
      type: props.type,
    };

    props.onAdd(task);
  };

  return (
    <div>
      <div className={classes["tasks__header"]}>
        <h2>{props.type}</h2>
        <Button onClick={addHandler}>Add</Button>
      </div>
      <TransitionGroup component="div" className={classes.tasks}>
        {props.tasks.map((task) => (
          <CSSTransition key={task.id} classNames="fade" timeout={300}>
            <Task
              onSave={props.onSave}
              onRemove={props.onRemove}
              onNextStep={props.onNextStep}
              {...task}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default TaskList;
