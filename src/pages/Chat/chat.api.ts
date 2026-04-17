import HTTPTransport from '../../framework/api';
import BaseAPI from "../../framework/base.api";

const chatAPIInstance = new HTTPTransport('api/v1/chats');

class ChatAPI extends BaseAPI {
    create() {
        // Здесь уже не нужно писать полный путь /api/v1/chats/
        return chatAPIInstance.post('/', {title: 'string'});
    }

    request() {
        // Здесь уже не нужно писать полный путь /api/v1/chats/
        return chatAPIInstance.get('/full');
    }
} 

export default ChatAPI