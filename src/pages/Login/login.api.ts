import HTTPTransport from '../../framework/api';
import BaseAPI from '../../framework/base.api';
import type { LoginFormData } from '../../entities/Auth';

const chatAPIInstance = new HTTPTransport('api/v2/auth');

class LoginPageAPI extends BaseAPI {
    signIn(data: LoginFormData) {
        return chatAPIInstance.post('/signin', { data });
    }
    authUser() {
        return chatAPIInstance.get('/user');
    }
}

export default LoginPageAPI;
