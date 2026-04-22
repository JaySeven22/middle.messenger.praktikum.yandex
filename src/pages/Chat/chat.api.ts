import HTTPTransport from '../../framework/api';
import BaseAPI from '../../framework/base.api';
import type { AddUserToChatData } from '../../entities/Chat';

const chatAPIInstance = new HTTPTransport('api/v2/chats');
const userAPIInstance = new HTTPTransport('api/v2/user');

class ChatAPI extends BaseAPI {
    getChats(offset?: number, limit?: number, title?: string) {
        return chatAPIInstance.get(`${offset ? `?offset=${offset}` : ''}${limit ? `&limit=${limit}` : ''}${title ? `&title=${title}` : ''}`);
    }
    createChat(title: string) {
        return chatAPIInstance.post('', { login: { title } });
    }
    searchUsers(login: string) {
        return userAPIInstance.post('/search', { data: { login } });
    }
    addUserToChat(data: AddUserToChatData) {
        return chatAPIInstance.put('/users', { data });
    }
    getUsersInChat(chatId: number) {
        return chatAPIInstance.get(`/${chatId}/users`);
    }
}

export default ChatAPI;
