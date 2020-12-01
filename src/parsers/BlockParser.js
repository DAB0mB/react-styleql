import { BlockNode } from '../nodes';
import { camelCase } from '../utils';
import Parser from './Parser';

class BlockParser extends Parser {
  parse() {
    const block = new BlockNode();
    const { childBlocks, rules } = block;

    this.cursor.next();

    loop:
    while (!this.cursor.done && !/\}/.test(this.cursor.value)) {
      switch (this.cursor.value) {
        case '&': {
          const selector = this.parseSelector();
          const childBlock = this.parseBlock();
          childBlock.selector = selector;
          childBlocks.push(childBlock);
          break;
        }
        default:
          if (this.cursor.nextIf('//')) {
            this.cursor.nextWhile(/[^\n]/);
            continue loop;
          }

          if (this.cursor.nextIf('/*')) {
            while (!this.cursor.nextIf('*/')) this.cursor.next();
            continue loop;
          }

          if (/\w/.test(this.cursor.value)) {
            const rule = this.parseRule();
            rules[rule.key] = rule.value;
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
    const key = this.cursor.nextWhile(/[^:]/, this.cursor).trim();

    return camelCase(key);
  }

  parseValue() {
    const value = this.cursor.nextWhile(/[^;]/);

    return this.parseParam(value);
  }
}

export default BlockParser;
