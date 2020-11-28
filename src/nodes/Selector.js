import Node from './Node';

class Selector extends Node {
  select(node) {
    const selection = [];

    for (let query of this.queries) {
      selection.push(...query.select(node));
    }

    return new Set(selection);
  }
}

export default Selector;
