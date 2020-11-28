import { getAllChildNodes } from '../utils';
import Node from './Node';

class Query extends Node {
  select(node, specifiers = this.specifiers.slice()) {
    let specifier = specifiers.shift();
    let selection;

    switch (specifier.type) {
      case '>':
        selection = [...node.children];
        break;
      case '*':
        selection = [...getAllChildNodes(node)];
        break;
      default:
        selection = [node];
    }

    selection = selection.filter((n) => typeof n == 'object');

    if (specifier.type !== '|') {
      specifier = specifiers.shift();
    }

    for (let filter of specifier.filters) {
      const test = (x) => (filter.isNegative ? !x : x);

      switch (filter.type) {
        case '.':
          selection = selection.filter((node) =>
            test(node.classNames.includes(filter.className))
          );
          break;
        case '@': {
          const offset = filter.offset > 0 ? filter.offset - 1 : selection.length + filter.offset;
          if (filter.isNegative) {
            selection = [...selection.slice(0, offset), ...selection.slice(offset + 1)];
          }
          else {
            selection = [selection[offset]].filter(Boolean);
          }
          break;
        }
        case '[]':
          selection = selection.filter((node) =>
            test(
              'value' in filter
                ? node.props[filter.key] === filter.value
                : filter.key in node.props
            )
          );
          break;
        default: {
          let type = this.parser.parseParam(filter.tagName);
          if (type === '&') type = node.type;
          selection = selection.filter((node) => test(node.type === type));
        }
      }
    }

    if (!specifiers.length) {
      return new Set(selection);
    }

    const selectionSet = new Set();

    for (let n of selection) {
      for (let s of this.select(n, specifiers.slice())) {
        selectionSet.add(s);
      }
    }

    return selectionSet;
  }
}

export default Query;
