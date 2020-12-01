import Node from './Node';

class QueryNode extends Node {
  constructor() {
    super();

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

    selection = selection.filter(($n) => typeof $n == 'object');

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
          const index = filter.index > 0 ? filter.index - 1 : selection.length + filter.index;
          if (filter.isNegative) {
            selection = [...selection.slice(0, index), ...selection.slice(index + 1)];
          }
          else {
            selection = [selection[index]].filter(Boolean);
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
          if (type === '*') {
            selection = filter.isNegative ? [] : selection;
            break;
          }
          if (type === '&') {
            type = $node.type;
          }
          selection = selection.filter(($n) => test($n.type === type));
        }
      }
    }

    if (!specifiers.length) {
      return new Set(selection);
    }

    const selectionSet = new Set();

    for (let $n of selection) {
      for (let $n2 of this.select($n, specifiers.slice())) {
        selectionSet.add($n2);
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
