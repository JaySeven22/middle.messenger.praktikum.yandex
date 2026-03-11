import Handlebars from 'handlebars';
import { userCardTemplate } from './userCard.tmpl';


Handlebars.registerPartial('userCard', userCardTemplate);

// Регистрируем хелпер для вычисляемых полей
Handlebars.registerHelper('eq', (a: string, b: string) => a === b);
Handlebars.registerHelper('gt', (a: number, b: number) => a > b);
Handlebars.registerHelper('firstLetter', (str: string) => str.charAt(0).toUpperCase());