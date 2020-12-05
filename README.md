# StyleQL

Motivation: React-Native doesn't ship with a CSS query selector engine like the browser does. As such, I had to implement a custom query selector engine, that uses 100% JavaScript and is completely separated from the DOM API; thus StyleQL was born.

StyleQL was built with React-Native in mind, but it's completely agnostic to the framework or the environment you're using, so in theory, it can be used anywhere. For now, there's a single adapter to support React applications, with 3 environments in mind: DOM (browser, [Electron](https://www.electronjs.org/)), [React-Native](https://reactnative.dev/), and [Ink](https://github.com/vadimdemedes/ink) (for building CLIs).

StyleQL differs in the following from a traditional style sheet:

- It's completely independent from the DOM and uses 100% JavaScript.
- It introduces custom query selectors and syntax rules for optimal styling experience.
- Its query selectors work based on Components and props, rather than HTML tag-names and attributes.
- It has full encapsulation per Component.
- It can dynamically evaluate style rules based on given props and theming manifest.

Here's one way I use StyleQL while avoiding the over-specification of style attributes in some elements:

```jsx
import styleql from '@styleql/react/native';
import { TouchableWithoutFeedback, View, Text } from 'react-native';

import { shadeColor } from './utils';

const MyButton = styleql(TouchableWithoutFeedback) `
  & > ${View} {
    background-color: $theme.primaryBg;
    justify-content: center;
    align-items: center;
    padding-horizontal: 20px;
    padding-vertical: 5px;

    & .pressed {
      background-color: ${(props, theme) => shadeColor(theme.primaryBg, .5)};
    }

    & > ${Text} {
      color: $theme.primaryTxt;

      & .bold {
        font-weight: 700;
      }
    }
  }
`;
```

It's important to note that **StyleQL is a concept! And was not tested with a real application** (yet). However, you can see StyleQL in action in the following [Code Sandbox link](https://codesandbox.io/s/react-styleql-testjs-02wh1).

To install:

    $ yarn add @styleql/core @styleql/react
