import Handlebars from 'handlebars';
import { cardTemplate } from './card.tmpl';

if (!Handlebars.helpers['or']) {
  Handlebars.registerHelper('or', (a: unknown, b: unknown) => a || b);
}

Handlebars.registerPartial('card', cardTemplate);
