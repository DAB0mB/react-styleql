export type Theme = { [key: string]: any };
export type StyleQLOverload1 = (strs: TemplateStringsArray, ...params: any[]) => React.FC<any>;
export type StyleQLOverload2 = (Element: { new(...args: any[]): React.Component<any, any> } | React.FC<any>) => StyleQLOverload1;
export type ThemeContext = React.Context<Theme>
export type ThemeProvider = React.FC<{ theme: Theme; children: React.ReactChildren }>
export type useTheme = () => Theme;
export type bindStyleQLSheet = (Element: { new(...args: any[]): React.Component<any, any> } | React.FC<any>) => React.FC<{ [key: string]: any }>;
type styleql = StyleQLOverload1 | StyleQLOverload2;

export default styleql;
