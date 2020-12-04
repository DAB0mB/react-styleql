// Visit: codesandbox.io/s/react-styleql-testjs-02wh1
import styleql, { ThemeProvider } from "@styleql/react/native";
import React from "react";
import { View, ScrollView, Text } from "react-native";

const Br = styleql(View)`
  margin-top: 20px;
`;

const Title = styleql(Text)`
  font-weight: 700;
`;

const AllChildrenOfTypeStyle = styleql`
  & ${View} {
    background-color: blue;
  }

  & ${Text} {
    color: white;
  }
`;

const AllChildrenOfType = () => {
  return (
    <React.Fragment>
      <Title>All Children of Type</Title>
      <AllChildrenOfTypeStyle>
        <View>
          <Text>outer element 1</Text>
        </View>
        <React.Fragment>
          <View>
            <Text>inner element 2</Text>
          </View>
          <View>
            <Text>inner element 3</Text>
          </View>
        </React.Fragment>
        <View>
          <Text>outer element 4</Text>
        </View>
      </AllChildrenOfTypeStyle>
    </React.Fragment>
  );
};

const AllDirectChildrenOfTypeStyle = styleql`
  & > ${View} {
    background-color: blue;

    & > ${Text} {
      color: white;
    }
  }
`;

const AllDirectChildrenOfType = () => {
  return (
    <React.Fragment>
      <Title>All Direct Children of Type</Title>
      <AllDirectChildrenOfTypeStyle>
        <View>
          <Text>outer element 1</Text>
        </View>
        <React.Fragment>
          <View>
            <Text>inner element 2</Text>
          </View>
          <View>
            <Text>inner element 3</Text>
          </View>
        </React.Fragment>
        <View>
          <Text>outer element 4</Text>
        </View>
      </AllDirectChildrenOfTypeStyle>
    </React.Fragment>
  );
};

const AllChildrenWithClassStyle = styleql`
  & .red {
    background-color: red;
  }

  & .green {
    background-color: green;
  }

  & .blue {
    background-color: blue;
  }

  & ${Text} {
    color: white;
  }
`;

const AllChildrenWithClass = () => {
  return (
    <React.Fragment>
      <Title>All Children With Class</Title>
      <AllChildrenWithClassStyle>
        <View className="red">
          <Text>red</Text>
        </View>
        <View className="green">
          <Text>green</Text>
        </View>
        <View className="blue">
          <Text>blue</Text>
        </View>
      </AllChildrenWithClassStyle>
    </React.Fragment>
  );
};

const MultiClassStyle = styleql`
  & .bg-blue {
    background-color: blue;
  }

  & .text-white ${Text} {
    color: white;
  }

  & .text-red ${Text} {
    color: red;
  }
`;

const MultiClass = () => {
  return (
    <React.Fragment>
      <Title>Multi Class</Title>
      <MultiClassStyle>
        <View className="bg-blue text-white">
          <Text>blue background with white text</Text>
        </View>
        <View className="bg-blue text-red">
          <Text>blue background with red text</Text>
        </View>
      </MultiClassStyle>
    </React.Fragment>
  );
};

const NthChildrenStyle = styleql`
  & ${Text}!#3 {
    color: white;
  }

  & > #1, & > #2 {
    background-color: blue;
  }

  & > #-1, & > #-2 {
    background-color: red;
  }
`;

const NthChildren = () => {
  return (
    <React.Fragment>
      <Title>Nth Children</Title>
      <NthChildrenStyle>
        <View>
          <Text>1</Text>
        </View>
        <View>
          <Text>2</Text>
        </View>
        <View>
          <Text>3</Text>
        </View>
        <View>
          <Text>-2</Text>
        </View>
        <View>
          <Text>-1</Text>
        </View>
      </NthChildrenStyle>
    </React.Fragment>
  );
};

const NegativityStyle = styleql`
  & !#1 {
    color: white;
  }

  & !#-1 {
    color: white;
  }

  & !.red {
    background-color: blue;
  }

  & !.blue {
    background-color: red;
  }
`;

const Negativity = () => {
  return (
    <React.Fragment>
      <Title>Negativity</Title>
      <NegativityStyle>
        <Text className="red">not blue</Text>
        <Text className="blue">not red</Text>
      </NegativityStyle>
    </React.Fragment>
  );
};

const ByPropStyle = styleql`
  & ${Text} {
    color: white;
  }

  & [disabled=${false}] {
    background-color: green;
  }

  & [disabled=${true}] {
    background-color: red;
  }
`;

const ByProp = () => {
  return (
    <React.Fragment>
      <Title>By Prop</Title>
      <ByPropStyle>
        <Text disabled={true}>disabled</Text>
        <Text disabled={false}>enabled</Text>
      </ByPropStyle>
    </React.Fragment>
  );
};

const PropEvalStyle = styleql`
  & ${Text} {
    color: white;
    background-color: ${props => (props.disabled ? "red" : "green")};
  }
`;

const PropEval = () => {
  return (
    <React.Fragment>
      <Title>Prop Eval</Title>
      <PropEvalStyle>
        <Text disabled={true}>disabled</Text>
        <Text disabled={false}>enabled</Text>
      </PropEvalStyle>
    </React.Fragment>
  );
};

const ThemetEvalStyle = styleql`
  & ${Text} {
    color: white;
  }

  & .red {
    background-color: $theme.red;
  }

  & .green {
    background-color: $theme.green;
  }

  & .blue {
    background-color: ${(props, theme) => theme.blue};
  }
`;

const ThemeEval = () => {
  const [theme] = React.useState({ red: "red", green: "green", blue: "blue" });

  return (
    <ThemeProvider theme={theme}>
      <Title>Theme Eval</Title>
      <ThemetEvalStyle>
        <View className="red">
          <Text>red</Text>
        </View>
        <View className="green">
          <Text>green</Text>
        </View>
        <View className="blue">
          <Text>blue</Text>
        </View>
      </ThemetEvalStyle>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <ScrollView>
      <AllChildrenOfType />
      <Br />
      <AllDirectChildrenOfType />
      <Br />
      <AllChildrenWithClass />
      <Br />
      <MultiClass />
      <Br />
      <NthChildren />
      <Br />
      <Negativity />
      <Br />
      <ByProp />
      <Br />
      <PropEval />
      <Br />
      <ThemeEval />
    </ScrollView>
  );
};

export default App;
