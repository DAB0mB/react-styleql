class Parser {
  constructor(cursor, params) {
    this.cursor = cursor;
    this.params = params;
  }

  parseBlock() {
    const BlockParser = require('./BlockParser').default;

    return new BlockParser(this.cursor, this.params).parse();
  }

  parseSelector() {
    const SelectorParser = require('./SelectorParser').default;

    return new SelectorParser(this.cursor, this.params).parse();
  }

  parseQuery() {
    const QueryParser = require('./QueryParser').default;

    return new QueryParser(this.cursor, this.params).parse();
  }

  parseParam(literal) {
    literal = literal.trim();
    let value = literal;

    if (literal[0] === '$') {
      value = this.params[literal.slice(1)] ?? literal;
    }

    return value;
  }
}

export default Parser;
