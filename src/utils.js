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
