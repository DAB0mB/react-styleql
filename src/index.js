import React from 'react';

import StyleQLParser from './StyleQLParser';
import { isRN } from './utils';

export * from './nodes';
export { StyleQLParser };

export const ThemeContext = React.createContext(null);

export const ThemeProvider = ({ theme, children }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return React.useContext(ThemeContext);
};

export const bindStyleSheet = (Element) => {
  return (styleStr, ...params) => {
    const styleSheet = StyleQLParser.parse(styleStr, ...params);

    const createNode = (element) => {
      if (typeof element != 'object') return element;

      const type = element.type;
      const props = { ...element.props };
      const classNames = (props.className || '').split(/ +/).filter(Boolean);
      const style = isRN
        ? [].concat(props.style).filter(Boolean)
        : Object.assign({}, props.style);
      delete props.className;
      delete props.style;

      return {
        style,
        type,
        props,
        classNames,
        children: [].concat(props.children).filter(Boolean).map(element => createNode(element)),
      };
    };

    const createStyledChildren = (node) => {
      if (typeof node != 'object') return node;

      return React.createElement(
        node.type,
        node.type === React.Fragment ? node.props : {
          ...node.props,
          style: node.style
        },
        ...node.children.map((childNode) => {
          return createStyledChildren(childNode);
        })
      );
    };

    const StyledElement = (props) => {
      const root = createNode(<Element {...props} />);
      const theme = React.useContext(ThemeContext);

      styleSheet.applyStyles(root, theme);

      return createStyledChildren(root);
    };

    return StyledElement;
  };
};

export const createStyleSheet = (...args) => {
  return bindStyleSheet(React.Fragment)(...args);
};

const styleql = (...args) => {
  return createStyleSheet(...args);
};

styleql.bind = bindStyleSheet;

export default styleql;
