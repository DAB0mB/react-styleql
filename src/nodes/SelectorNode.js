import Node from './Node';

class SelectorNode extends Node {
  constructor() {
    super();

    this.queries = [];
  }

  select($node) {
    const selection = [];

    for (let query of this.queries) {
      selection.push(...query.select($node));
    }

    return new Set(selection);
  }
}

export default SelectorNode;
