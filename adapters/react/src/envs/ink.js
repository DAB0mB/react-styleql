import React from 'react';

import { bindStyleJSSheet } from '..';

export * from '..';

const handlers = {
  createProps($node) {
    if (!Object.keys($node.style).length) {
      return $node.props;
    }

    return { ...$node.props, ...$node.style };
  }
};

const stylejs = (...args) => {
  if (args[0] instanceof Array) {
    return bindStyleJSSheet(React.Fragment, handlers)(...args);
  }

  return bindStyleJSSheet(args[0], handlers);
};

export default stylejs;
