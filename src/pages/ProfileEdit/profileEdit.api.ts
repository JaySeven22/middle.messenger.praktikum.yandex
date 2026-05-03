import HTTPTransport from '../../framework/api';
import BaseAPI from '../../framework/base.api';
import type { UserData } from '../../entities/User';

const chatAPIInstance = new HTTPTransport('api/v2/user');

class ProfileEditPageAPI extends BaseAPI {
    changeUserProfile(data: UserData) {
        return chatAPIInstance.put('/profile', { data });
    }
    changeUserPassword(data: UserData) {
        return chatAPIInstance.put('/password', { data });
    }
    changeUserAvatar(data: FormData) {
        return chatAPIInstance.put('/profile/avatar', { data });
    }
}

export default ProfileEditPageAPI;
