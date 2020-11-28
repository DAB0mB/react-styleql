import { camelCase, isRN, global } from '../utils';
import Node from './Node';

class Block extends Node {
  applyStyles(node, theme) {
    const selection = this.selector.select(node);

    for (let s of selection) {
      const rules = Object.entries(this.rules).reduce((rules, [key, value]) => {
        if (typeof value == 'function') {
          const _props = global.props;
          const _theme = global.theme;
          try {
            global.props = s.props;
            global.theme = theme;
            value = value({ props: s.props, theme });
          }
          finally {
            global.props = _props;
            global.theme = _theme;
          }
        }
        else if (value.slice(0, 7) === '$theme.') {
          value = theme[camelCase(value.slice(7))];
        }
        else if (value.slice(0, 7) === '$props.') {
          value = s.props[camelCase(value.slice(7))];
        }

        rules[key] = value;

        return rules;
      }, {});

      if (isRN) {
        s.style.unshift(rules);
      }
      else {
        for (let key in rules) {
          if (!(key in s.style)) {
            s.style[key] = rules[key];
          }
        }
      }

      for (let block of this.childBlocks) {
        block.applyStyles(s, theme);
      }
    }
  }
}

export default Block;
