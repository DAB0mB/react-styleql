import { BlockNode } from '../nodes';
import { camelCase } from '../utils';
import Parser from './Parser';

class BlockParser extends Parser {
  parse() {
    const block = new BlockNode();
    const { childBlocks, rules } = block;

    this.cursor.next();

    loop:
    while (!this.cursor.done) {
      switch (this.cursor.value) {
        case '&': {
          const selector = this.parseSelector();
          const childBlock = this.parseBlock();
          childBlock.selector = selector;
          childBlocks.push(childBlock);
          break;
        }
        case '/': {
          if (this.cursor.offset(-1) != '/') break;
          this.cursor.nextWhileMatches(/[^\n]/);
          continue loop;
        }
        case '}': {
          break loop;
        }
        default:
          if (/\w/.test(this.cursor.value)) {
            const rule = this.parseRule();
            rules[rule.key] = rule.value;
            break;
          }
      }

      this.cursor.next();
    }

    return block;
  }

  parseRule() {
    const key = this.parseKey();
    const value = this.parseValue();

    return { key, value };
  }

  parseKey() {
    let key = this.cursor.value;

    this.cursor.next();

    while (!this.cursor.done && this.cursor.value !== ':') {
      key += this.cursor.value;
      this.cursor.next();
    }

    return camelCase(key.trim());
  }

  parseValue() {
    this.cursor.next();

    let value = this.cursor.value;

    while (!this.cursor.done && this.cursor.value !== ';') {
      value += this.cursor.value;
      this.cursor.next();
    }

    return this.parseParam(value);
  }
}

export default BlockParser;
