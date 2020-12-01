import { QueryNode } from '../nodes';
import Parser from './Parser';
import { camelCase } from '../utils';

class QueryParser extends Parser {
  parse() {
    const query = new QueryNode();
    const specifiers = query.specifiers;

    while (!this.cursor.done && !/[{,]/.test(this.cursor.value)) {
      switch (this.cursor.value) {
        case '>':
          specifiers.push({ type: '>' });
          this.cursor.next();
          break;
        default:
          if (specifiers[specifiers.length - 1]?.type === '|') {
            specifiers.push({ type: '*' });
          }
          specifiers.push(this.parseFilter());
      }

      this.cursor.nextWhile(/[\n ]/, this.cursor);
    }

    return query;
  }

  parseFilter() {
    const specifier = { type: '|', filters: [] };
    const filters = specifier.filters;

    while (!this.cursor.done && !/[\n ,{]/.test(this.cursor.value)) {
      const filter = {};

      if (this.cursor.value === '!') {
        filter.isNegative = true;
        this.cursor.next();
      }

      switch (this.cursor.value) {
        case '.':
          filter.type = '.';
          filter.className = this.cursor.nextWhile(/[\w-_]/);
          break;
        case '#':
          filter.type = '#';
          filter.index = Number(this.cursor.next().value + this.cursor.nextWhile(/\d/));
          break;
        case '[':
          filter.type = '[]';
          filter.key = camelCase(this.cursor.nextWhile(/[^=\]]/).trim());
          if (this.cursor.value !== ']')
            filter.value = this.parseParam(this.cursor.nextWhile(/[^\]]/));
          this.cursor.next();
          break;
        default:
          if (/[&*$\w]/.test(this.cursor.value)) {
            filter.type = '*';
            filter.elementType = this.parseParam(this.cursor.value + this.cursor.nextWhile(/[\w-_]/));
            break;
          }

          this.cursor.next();
      }

      if (filter.type) {
        filters.push(filter);
      }
    }

    return specifier;
  }
}

export default QueryParser;
