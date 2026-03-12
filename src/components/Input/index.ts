import Handlebars from 'handlebars';
import { inputTemplate } from './input.tmpl';

// Регистрируем Input как partial — {{> input}}
Handlebars.registerPartial('input', inputTemplate);

