class Node {
  constructor(parser) {
    Object.defineProperty(this, 'parser', {
      configurable: true,
      value: parser,
    });
  }
}

export default Node;
