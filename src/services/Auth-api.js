import axios from "axios";

const AuthApi = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/accounts"
});

export default AuthApi;

export const AuthApiKey = "auth key";
