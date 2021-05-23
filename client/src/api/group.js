import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const __fetchGroups = () => {
  return axios.get(BASE_URL);
};

export const __addGroup = (name) => {
  return axios.post(BASE_URL + "/add", { name });
};

export const __deleteGroup = (id) => {
  return axios.post(BASE_URL + "/delete", { id });
};
