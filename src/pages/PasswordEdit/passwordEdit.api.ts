import HTTPTransport from '../../framework/api';
import BaseAPI from '../../framework/base.api';
import type { PasswordEditFormData } from '../../entities/Auth';

const chatAPIInstance = new HTTPTransport('api/v2/user');

class PasswordEditPageAPI extends BaseAPI {
    chamgePassword(data: PasswordEditFormData) {
        return chatAPIInstance.put('/password', { data });
    }
}

export default PasswordEditPageAPI;
