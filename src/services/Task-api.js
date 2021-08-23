import axios from "axios";

const TaskApi = axios.create({
  baseURL: "firebaseurl",
});

export default TaskApi;
