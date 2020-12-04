import React from 'react';

import { bindStyleQLSheet } from '..';

export * from '..';

const handlers = {
  createProps($node) {
    if (!Object.keys($node.style).length) {
      return $node.props;
    }

    return {
      ...$node.props,
      style: [].concat($node.style, $node.props.style).filter(Boolean),
    };
  }
};

const styleql = (...args) => {
  if (args[0] instanceof Array) {
    return bindStyleQLSheet(React.Fragment, handlers)(...args);
  }

  return bindStyleQLSheet(args[0], handlers);
};

export default styleql;
