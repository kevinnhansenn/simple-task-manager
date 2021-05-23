import axios from "axios";

const BASE_URL = `${window.location.origin.replace(":8080", "")}:5001`;

export const __fetchTasks = () => {
  return axios.get(BASE_URL);
};

export const __addTask = ({ name, deadline, description, group }) => {
  return axios.post(BASE_URL + "/add", { name, deadline, description, group });
};

export const __completeTask = (id) => {
  return axios.post(BASE_URL + "/complete", { id });
};

export const __editTask = ({ id, name, deadline, description }) => {
  return axios.post(BASE_URL + "/edit", {
    id,
    name,
    deadline,
    description,
  });
};

export const __deleteTasks = (listOfId) => {
  return axios.post(BASE_URL + "/delete", { listOfId });
};

export const __moveTasks = (listOfId, targetGroup) => {
  return axios.post(BASE_URL + "/move", { listOfId, targetGroup });
};
