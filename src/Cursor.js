class Cursor {
  get value() {
    return this.str[this.pos];
  }

  get done() {
    return ~this.pos && this.value == null;
  }

  constructor(str) {
    this.pos = -1;
    this.str = str;
  }

  offset(n) {
    return this.str[this.pos + n];
  }

  next() {
    this.pos++;

    return { value: this.value, done: this.done };
  }

  nextIf(pattern) {
    let pos = 0;
    let value = this.value;
    let str = value;

    while (value != null && str !== pattern) {
      str += value = this.offset(++pos);
    }

    if (str !== pattern) {
      return false;
    }

    while (pos--) this.next();

    return true;
  }

  nextWhile(pattern, result = this.next()) {
    let str = '';

    while (!result.done && result.value.match(pattern)) {
      str += result.value;
      result = this.next();
    }

    return str;
  }
}

export default Cursor;
