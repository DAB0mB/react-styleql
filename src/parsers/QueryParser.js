import { QueryNode } from '../nodes';
import Parser from './Parser';
import { camelCase } from '../utils';

class QueryParser extends Parser {
  parse() {
    const query = new QueryNode();
    const specifiers = query.specifiers;

    loop:
    while (!this.cursor.done) {
      switch (this.cursor.value) {
        case '>':
          specifiers.push({ type: '>' });
          break;
        case ',':
        case '{':
          break loop;
        case '\n':
        case ' ':
          break;
        default:
          if (specifiers[specifiers.length - 1]?.type === '|') {
            specifiers.push({ type: '*' });
          }
          specifiers.push(this.parseFilter());
          if (this.cursor.value.trim()) {
            break loop;
          }
      }

      this.cursor.next();
    }

    return query;
  }

  parseFilter() {
    const specifier = { type: '|', filters: [] };
    const filters = specifier.filters;

    loop:
    while (!this.cursor.done) {
      const filter = {};

      if (this.cursor.value === '!') {
        filter.isNegative = true;
        this.cursor.next();
      }

      switch (this.cursor.value) {
        case '.':
          filter.type = '.';
          filter.className = this.cursor.nextWhileMatches(/[\w-_]/);
          break;
        case '#':
          filter.type = '#';
          filter.offset = Number(this.cursor.next().value + this.cursor.nextWhileMatches(/\d/));
          break;
        case '[':
          filter.type = '[]';
          filter.key = camelCase(this.cursor.nextWhileMatches(/[^=\]]/));
          if (this.cursor.value !== ']')
            filter.value = this.parseParam(this.cursor.nextWhileMatches(/[^\]]/));
          this.cursor.next();
          break;
        case '\n':
        case ' ':
        case ',':
        case '{':
          break loop;
        default:
          if (/[&*$\w]/.test(this.cursor.value)) {
            filter.type = '*';
            filter.elementType = this.parseParam(this.cursor.value + this.cursor.nextWhileMatches(/[\w-_]/));
            break;
          }

          this.cursor.next();
          continue loop;
      }

      filters.push(filter);
    }

    return specifier;
  }
}

export default QueryParser;
