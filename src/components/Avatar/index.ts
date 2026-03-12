import Handlebars from 'handlebars';
import { avatarTemplate } from './avatar.tmpl';

// Регистрируем Avatar как partial — {{> avatar}}
Handlebars.registerPartial('avatar', avatarTemplate);

