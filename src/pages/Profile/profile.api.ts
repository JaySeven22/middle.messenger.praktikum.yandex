import HTTPTransport from '../../framework/api';
import BaseAPI from "../../framework/base.api";

const chatAPIInstance = new HTTPTransport('api/v2/auth');

export interface LoginFormData {
    login: string;
    password: string;
  }

class ProfilePageAPI extends BaseAPI {
    logout() {
        return chatAPIInstance.post('/logout');
    }
} 

export default ProfilePageAPI