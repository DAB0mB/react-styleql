class Cursor {
  get value() {
    return this.str[this.position];
  }

  get done() {
    return ~this.position && this.value == null;
  }

  constructor(str) {
    this.position = -1;
    this.str = str;
  }

  next() {
    this.position++;

    return { value: this.value, done: this.done };
  }

  offset(n) {
    return this.str[this.position + n];
  }

  nextWhileMatches(pattern, result = this.next()) {
    let str = '';

    while (!result.done && result.value.match(pattern)) {
      str += result.value;
      result = this.next();
    }

    return str;
  }
}

export default Cursor;
