import { camelCase } from '../utils';
import Node from './Node';

class BlockNode extends Node {
  constructor() {
    super();

    this.selector = null;
    this.childBlocks = [];
    this.rules = {};
  }

  applyStyles($node, theme = {}) {
    const selection = this.selector.select($node);

    for (let $n of selection) {
      const rules = Object.entries(this.rules).reduce((rules, [key, value]) => {
        if (typeof value == 'function') {
          value = value($n.props, theme);
        }
        else if (value.slice(0, 7) === '$theme.') {
          value = theme[camelCase(value.slice(7))];
        }
        else if (value.slice(0, 7) === '$props.') {
          value = $n.props[camelCase(value.slice(7))];
        }

        rules[key] = value;

        return rules;
      }, {});

      for (let key in rules) {
        if (!(key in $n.style)) {
          $n.style[key] = rules[key];
        }
      }

      for (let childBlock of this.childBlocks) {
        childBlock.applyStyles($n, theme);
      }
    }
  }
}

export default BlockNode;
