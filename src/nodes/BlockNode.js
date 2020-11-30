import { camelCase, isRN } from '../utils';
import Node from './Node';

class BlockNode extends Node {
  constructor(params) {
    super(params);

    this.selector = null;
    this.childBlocks = [];
    this.rules = {};
  }

  applyStyles($node, theme) {
    const selection = this.selector.select($node);

    for (let $s of selection) {
      const rules = Object.entries(this.rules).reduce((rules, [key, value]) => {
        if (typeof value == 'function') {
          value = value($s.props, theme);
        }
        else if (value.slice(0, 7) === '$theme.') {
          value = theme[camelCase(value.slice(7))];
        }
        else if (value.slice(0, 7) === '$props.') {
          value = $s.props[camelCase(value.slice(7))];
        }

        rules[key] = value;

        return rules;
      }, {});

      if (isRN) {
        $s.style.unshift(rules);
      }
      else {
        for (let key in rules) {
          if (!(key in $s.style)) {
            $s.style[key] = rules[key];
          }
        }
      }

      for (let childBlock of this.childBlocks) {
        childBlock.applyStyles($s, theme);
      }
    }
  }
}

export default BlockNode;
