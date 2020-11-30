import { SelectorNode } from '../nodes';
import Parser from './Parser';

class SelectorParser extends Parser {
  parse() {
    const selector = new SelectorNode();
    const queries = selector.queries;

    while (!this.cursor.done && this.cursor.value !== '{') {
      const query = this.parseQuery();
      queries.push(query);
      this.cursor.nextWhileMatches(/[\n, ]/, this.cursor);
    }

    return selector;
  }
}

export default SelectorParser;
