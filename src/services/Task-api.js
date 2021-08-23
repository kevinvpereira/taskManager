import axios from "axios";

const TaskApi = axios.create({
  baseURL: "https://react-course-hooks-8a5fd-default-rtdb.firebaseio.com",
});

export default TaskApi;
