import Handlebars from 'handlebars';
import { searchInputTemplate } from './searchInput.tmpl';

// Регистрируем SearchInput как partial — {{> searchInput}}
Handlebars.registerPartial('searchInput', searchInputTemplate);

