import { Block, Query, Selector } from './nodes';
import { camelCase, nextWhileMatches } from './utils';

class StyleQLParser {
  static parse(...args) {
    const parser = new StyleQLParser(...args);

    const query = new Query(parser);
    query.specifiers = [{ type: '|', filters: [{ type: '*', tagName: '&' }] }];

    const selector = new Selector(parser);
    selector.queries = [query];

    const block = parser.parseBlock();
    block.selector = selector;

    return block;
  }

  get value() {
    return this.template[this.position];
  }

  get done() {
    return ~this.position && this.value == null;
  }

  constructor(parts, ...params) {
    this.params = [...new Set(params)];
    this.position = -1;

    this.template = parts
      .reduce((split, part, index) => {
        split.push(part);

        const uniqIndex = this.params.indexOf(params[index]);

        if (~uniqIndex) {
          split.push('$' + uniqIndex);
        }

        return split;
      }, [])
      .join('');
  }

  next() {
    this.position++;

    return { value: this.value, done: this.done };
  }

  offset(n) {
    return this.template[this.position + n];
  }

  parseBlock() {
    const block = new Block(this);
    block.rules = {};
    block.childBlocks = [];

    this.next();

    loop:
    while (!this.done) {
      switch (this.value) {
        case '&': {
          const selector = this.parseSelector();
          const childBlock = this.parseBlock();
          childBlock.selector = selector;
          block.childBlocks.push(childBlock);
          break;
        }
        case '/': {
          if (this.offset(-1) != '/') break;
          nextWhileMatches(this, /[^\n]/);
          continue loop;
        }
        case '}': {
          break loop;
        }
        default:
          if (/\w/.test(this.value)) {
            const rule = this.parseRule();
            block.rules[rule.key] = rule.value;
            break;
          }
      }

      this.next();
    }

    return block;
  }

  parseRule() {
    const key = this.parseKey();
    const value = this.parseValue();

    return { key, value };
  }

  parseKey() {
    let key = this.value;

    this.next();

    while (!this.done && this.value !== ':') {
      key += this.value;
      this.next();
    }

    return camelCase(key.trim());
  }

  parseValue() {
    this.next();

    let value = this.value;

    while (!this.done && this.value !== ';') {
      value += this.value;
      this.next();
    }

    return this.parseParam(value);
  }

  parseSelector() {
    const selector = new Selector(this);
    selector.queries = [];

    while (!this.done && this.value !== '{') {
      const query = this.parseQuery();
      selector.queries.push(query);
      nextWhileMatches(this, /[\n, ]/, this);
    }

    return selector;
  }

  parseQuery() {
    const query = new Query(this);
    const specifiers = (query.specifiers = []);

    loop: while (!this.done) {
      switch (this.value) {
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
          specifiers.push(this.parseFilterSpecifier());
          if (this.value.trim()) {
            break loop;
          }
      }

      this.next();
    }

    return query;
  }

  parseFilterSpecifier() {
    const specifier = { type: '|' };
    const filters = (specifier.filters = []);

    loop:
    while (!this.done) {
      const filter = {};

      if (this.value === '!') {
        filter.isNegative = true;
        this.next();
      }

      switch (this.value) {
        case '.':
          filter.type = '.';
          filter.className = nextWhileMatches(this, /[\w-_]/);
          break;
        case '@':
          filter.type = '@';
          filter.offset = Number(this.next().value + nextWhileMatches(this, /\d/));
          break;
        case '[':
          filter.type = '[]';
          filter.key = camelCase(nextWhileMatches(this, /[^=\]]/));
          if (this.value !== ']')
            filter.value = this.parseParam(nextWhileMatches(this, /[^\]]/));
          this.next();
          break;
        case '\n':
        case ' ':
        case ',':
        case '{':
          break loop;
        default:
          if (/[&$\w-_]/.test(this.value)) {
            filter.type = '*';
            filter.tagName = this.value + nextWhileMatches(this, /[\w-_]/);
            break;
          }

          this.next();
          continue loop;
      }

      filters.push(filter);
    }

    return specifier;
  }

  parseParam(literal) {
    literal = literal.trim();
    let value = literal;

    if (literal[0] === '$') {
      value = this.params[literal.slice(1)] ?? literal;
    }

    return value;
  }
}

export default StyleQLParser;
