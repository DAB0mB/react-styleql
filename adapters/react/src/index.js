import React from 'react';

import { parseStyleQLSheet } from '@styleql/core';

export const ThemeContext = React.createContext(null);

export const ThemeProvider = ({ theme, children }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return React.useContext(ThemeContext);
};

export const bindStyleQLSheet = (Component, { createProps }) => {
  return (strs, ...params) => {
    const styleSheet = parseStyleQLSheet(strs, ...params);

    const createNode = (element) => {
      if (typeof element != 'object') return element;

      const type = element.type;
      const props = { ...element.props };
      const classNames = (props.className || '').split(/ +/).filter(Boolean);
      delete props.className;

      return {
        type,
        props,
        classNames,
        style: {},
        children: [].concat(props.children).filter(Boolean).map(element => createNode(element)),
      };
    };

    const createStyledChildren = ($node) => {
      if (typeof $node != 'object') return $node;

      return React.createElement(
        $node.type,
        $node.type === React.Fragment ? $node.props : createProps($node),
        ...$node.children.map((childNode) => {
          return createStyledChildren(childNode);
        })
      );
    };

    const StyledElement = (props) => {
      const $root = createNode(<Component {...props} />);
      const theme = React.useContext(ThemeContext);

      styleSheet.applyStyles($root, theme);

      return createStyledChildren($root);
    };

    return StyledElement;
  };
};
