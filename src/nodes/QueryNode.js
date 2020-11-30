import Node from './Node';

class QueryNode extends Node {
  constructor(params) {
    super(params);

    this.specifiers = [];
  }

  select($node, specifiers = this.specifiers.slice()) {
    let specifier = specifiers.shift();
    let selection;

    switch (specifier.type) {
      case '>':
        selection = [...$node.children];
        break;
      case '*':
        selection = [...getAllChildNodes($node)];
        break;
      default:
        selection = [$node];
    }

    selection = selection.filter((n) => typeof n == 'object');

    if (specifier.type !== '|') {
      specifier = specifiers.shift();
    }

    for (let filter of specifier.filters) {
      let test = (x) => (filter.isNegative ? !x : x);

      switch (filter.type) {
        case '.':
          selection = selection.filter(($n) =>
            test($n.classNames.includes(filter.className))
          );
          break;
        case '#': {
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
          selection = selection.filter(($n) =>
            test(
              'value' in filter
                ? $n.props[filter.key] === filter.value
                : filter.key in $n.props
            )
          );
          break;
        default: {
          let type = filter.elementType;
          if (type === '*') test = () => !filter.isNegative;
          else if (type === '&') type = $node.type;
          selection = selection.filter(($n) => test($n.type === type));
        }
      }
    }

    if (!specifiers.length) {
      return new Set(selection);
    }

    const selectionSet = new Set();

    for (let $n of selection) {
      for (let $s of this.select($n, specifiers.slice())) {
        selectionSet.add($s);
      }
    }

    return selectionSet;
  }
}

const getAllChildNodes = (node, allChildNodes = new Set()) => {
  if (typeof node != 'object') return allChildNodes;

  for (let childNode of node.children) {
    allChildNodes.add(childNode);
  }

  for (let childNode of node.children) {
    getAllChildNodes(childNode, allChildNodes);
  }

  return allChildNodes;
};

export default QueryNode;
