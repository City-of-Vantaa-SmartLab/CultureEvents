const content = require('./content.json');
export class I18Service {
  language = 'fi';
  getContents = () => {
    switch (this.language.toLowerCase()) {
      case 'sv':
        return content.swedish;
      case 'en':
        return content.english;
      default:
        return content.finnish;
    }
  };
}
