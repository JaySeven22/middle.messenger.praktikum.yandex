import HTTPTransport from '../../framework/api';
import BaseAPI from '../../framework/base.api';

const chatAPIInstance = new HTTPTransport('api/v2/auth');

class ProfilePageAPI extends BaseAPI {
    logout() {
        return chatAPIInstance.post('/logout');
    }
}

export default ProfilePageAPI;
