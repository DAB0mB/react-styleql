export type Theme = { [key: string]: any };
export const ThemeContext: React.Context<Theme>;
export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactChildren }>
export function useTheme(): Theme;
declare function createStyleJSSheet(strs: TemplateStringsArray, ...params: any[]): React.FC<any>;
declare function bindStyleJSSheet(Component: { new(...args: any[]): React.Component<any, any> } | React.FC<any>): typeof createStyleJSSheet;
declare const stylejs: typeof createStyleJSSheet | typeof bindStyleJSSheet;

export default stylejs;
