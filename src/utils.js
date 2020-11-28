export const isRN = typeof document == 'undefined';
export const isBrowser = !isRN;
export const global = isRN ? global : window;

export const splitWords = (str) => {
  return str
    .replace(/[A-Z]/g, ' $&')
    .split(/[^a-zA-Z0-9]+/)
    .filter((word) => word.trim());
};

export const upperFirst = (str) => {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
};

export const camelCase = (str) => {
  const words = splitWords(str);
  const first = words.shift().toLowerCase();
  const rest = words.map(upperFirst);

  return [first, ...rest].join('');
};

export const getAllChildNodes = (node, allChildNodes = new Set()) => {
  if (typeof node != 'object') return allChildNodes;

  for (let childNode of node.children) {
    allChildNodes.add(childNode);
  }

  for (let childNode of node.children) {
    getAllChildNodes(childNode, allChildNodes);
  }

  return allChildNodes;
};

export const nextWhileMatches = (iterator, pattern, result = iterator.next()) => {
  let str = '';

  while (!result.done && result.value.match(pattern)) {
    str += result.value;
    result = iterator.next();
  }

  return str;
};
