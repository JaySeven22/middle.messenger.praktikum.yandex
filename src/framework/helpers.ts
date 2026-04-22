import Handlebars from 'handlebars';

if (!Handlebars.helpers['or']) {
  Handlebars.registerHelper('or', (a: unknown, b: unknown) => a || b);
}

if (!Handlebars.helpers['gt']) {
  Handlebars.registerHelper('gt', (a: number, b: number) => a > b);
}

if (!Handlebars.helpers['eq']) {
  Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);
}

if (!Handlebars.helpers['firstLetter']) {
  Handlebars.registerHelper('firstLetter', (str: string) => str?.charAt(0).toUpperCase() ?? '');
}
