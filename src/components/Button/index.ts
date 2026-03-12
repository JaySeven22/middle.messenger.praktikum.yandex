import Handlebars from 'handlebars';
import { buttonTemplate } from './button.tmpl';

if (!Handlebars.helpers['or']) {
  Handlebars.registerHelper('or', (a: unknown, b: unknown) => a || b);
}

Handlebars.registerPartial('button', buttonTemplate);
