import { useContext, useEffect, useState } from "react";
import TaskList from "../Components/TaskList";
import TaskApi from "../services/Task-api";
import Header from "../UI/Header";
import Error from "../UI/Error";
import classes from "./Tasks.module.css";
import AuthContext from "../store/auth-context";

const TASKS_TYPES = {
  todo: "To Do",
  doing: "Doing",
  done: "Done",
};

const todo = {
  class: "task-to-do",
  color: "red",
  type: TASKS_TYPES.todo,
};

const doing = {
  class: "task-doing",
  color: "blue",
  type: TASKS_TYPES.doing,
};

const done = {
  class: "task-done",
  color: "green",
  type: TASKS_TYPES.done,
};

const getTasksFromResponse = (response) => {
  const tasks = [];
  for (const key in response) {
    if (response[key]) {
      tasks.push({
        ...response[key],
        id: key,
      });
    }
  }

  return tasks;
};

const Tasks = () => {
  const context = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await TaskApi.get("/task.json");
        setTasks(getTasksFromResponse(response.data).filter(x => x.email === context.email));
      } catch (ex) {
        errorHandler(ex);
      }
    };

    getTasks();
  }, []);

  const saveHandler = (task) => {
    const updateTask = async () => {
      const response = await TaskApi.patch(`/task/${task.id}.json`, {
        type: task.type,
        tag: task.tag,
        name: task.name,
        description: task.description,
        date: task.date,
        status: task.status,
        email: context.email
      });

      if (response.status === 200) {
        setTasks((prevTasks) => {
          const taskIndex = prevTasks.findIndex((x) => x.id === task.id);

          prevTasks[taskIndex] = task;

          return [...prevTasks];
        });
      }
    };

    updateTask();
  };

  const removeHandler = (id) => {
    const deleteTask = async () => {
      try {
        const response = await TaskApi.delete(`/task/${id}.json`);
        if (response.status === 200)
          setTasks((prevTasks) => [...prevTasks.filter((x) => x.id !== id)]);
      } catch (ex) {
        errorHandler(ex);
      }
    };

    deleteTask();
  };

  const addHandler = async (task) => {
    if (!tasks.find((x) => !x.name)) {
      try {
        const response = await TaskApi.post("/task.json", {...task, email: context.email});
        if (response.status === 200) {
          task.id = response.data.name;

          setTasks((prevTasks) => [task, ...prevTasks]);
        }
      } catch (ex) {
        errorHandler(ex);
      }
    }
  };

  const updateStatus = async (id, type) => {
    try {
      const response = await TaskApi.patch(`/task/${id}.json`, {
        type: type,
      });

      if (response.status === 200) {
        setTasks((prevTasks) => {
          const taskIndex = prevTasks.findIndex((x) => x.id === id);
          prevTasks[taskIndex].type = type;

          return [...prevTasks];
        });
      }
    } catch (ex) {
      errorHandler(ex);
    }
  };

  const changeTypeHandler = (id, type) => {
    switch (type) {
      case TASKS_TYPES.todo:
        updateStatus(id, TASKS_TYPES.doing);
        break;
      case TASKS_TYPES.doing:
        updateStatus(id, TASKS_TYPES.done);
        break;
      default:
        removeHandler(id);
        break;
    }
  };

  const errorHandler = (newError) => {
    console.log(newError)
    setError({message: "Something went wrong"});
  };

  return (
    <div className={classes.tasks}>
      <Error error={error}/>
      <div className={classes["task-list"]}>
        <TaskList
          tasks={tasks.filter((x) => x.type === TASKS_TYPES.todo)}
          {...todo}
          onSave={saveHandler}
          onRemove={removeHandler}
          onAdd={addHandler}
          onNextStep={changeTypeHandler}
        />
        <TaskList
          tasks={tasks.filter((x) => x.type === TASKS_TYPES.doing)}
          {...doing}
          onSave={saveHandler}
          onRemove={removeHandler}
          onAdd={addHandler}
          onNextStep={changeTypeHandler}
        />
        <TaskList
          tasks={tasks.filter((x) => x.type === TASKS_TYPES.done)}
          {...done}
          onSave={saveHandler}
          onRemove={removeHandler}
          onAdd={addHandler}
          onNextStep={changeTypeHandler}
        />
      </div>
    </div>
  );
};

export default Tasks;
