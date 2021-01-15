# StyleJS

Motivation: React-Native doesn't ship with a CSS query selector engine like the browser does. Accordingly, I have decided to implement a custom query selector engine, that uses 100% JavaScript and is completely separated from the DOM API. I call it StyleJS.

While StyleJS was built with React-Native in mind, it's completely agnostic to the framework or the environment you're using, so in theory, it can be used anywhere. For now, there's a single adapter to support React applications, in 3 different environments: DOM (browser, [Electron](https://www.electronjs.org/)), [React-Native](https://reactnative.dev/), and [Ink](https://github.com/vadimdemedes/ink) (for building CLIs).

StyleJS differs in the following from a traditional style sheet:

- It's completely independent from the DOM and uses 100% JavaScript.
- It introduces custom query selectors and syntax rules for optimal styling experience.
- Its query selectors work based on Components and props, rather than HTML tag-names and attributes.
- It has full encapsulation per Component.
- It can dynamically evaluate style rules based on given props and theme config.

Here's one example of how to use StyleJS:

```jsx
import style from '@stylejs/react/native';
import { TouchableWithoutFeedback, View, Text } from 'react-native';

import { shadeColor } from './utils';

const MyButton = style(TouchableWithoutFeedback) `
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

You can also visit this [Code Sandbox link](https://codesandbox.io/s/react-stylejs-testjs-02wh1) for an interactive StyleJS demo. It's important to note that **StyleJS is a concept! And was not tested with a real application** (yet).

To install:

    $ yarn add @stylejs/core @stylejs/react
