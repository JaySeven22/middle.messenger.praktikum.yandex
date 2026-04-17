import HTTPTransport from '../../framework/api';
import BaseAPI from "../../framework/base.api";

const chatAPIInstance = new HTTPTransport('api/v2/auth');

export interface LoginFormData {
    login: string;
    password: string;
  }

class LoginPageAPI extends BaseAPI {
    signIn(data: LoginFormData) {
        return chatAPIInstance.post('/signin', { data });
    }
} 

export default LoginPageAPI