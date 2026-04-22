import HTTPTransport from '../../framework/api';
import BaseAPI from '../../framework/base.api';
import type { RegisterFormData } from '../../entities/Auth';

const chatAPIInstance = new HTTPTransport('api/v2/auth');

class RegisterPageAPI extends BaseAPI {
    createUser(data: RegisterFormData) {
        return chatAPIInstance.post('/signup', { data });
    }
}

export default RegisterPageAPI;
