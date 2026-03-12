import axios from "axios"; 

// Initialisation de Axios /
const instance = axios.create({
  baseURL: "http://127.0.0.1:5001/e-clone-f1b94/us-central1/api",
})

export default instance; 