import HTTPTransport from '../../framework/api';
import BaseAPI from "../../framework/base.api";

const chatAPIInstance = new HTTPTransport('api/v2/auth');

export interface RegisterFormData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
  }

class RegisterPageAPI extends BaseAPI {
    createUser(data: RegisterFormData) {
        return chatAPIInstance.post('/signup', { data });
    }
} 

export default RegisterPageAPI