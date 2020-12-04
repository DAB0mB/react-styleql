export type Theme = { [key: string]: any };
export const ThemeContext: React.Context<Theme>;
export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactChildren }>
export function useTheme(): Theme;
declare function createStyleQLSheet(strs: TemplateStringsArray, ...params: any[]): React.FC<any>;
declare function bindStyleQLSheet(Component: { new(...args: any[]): React.Component<any, any> } | React.FC<any>): typeof createStyleQLSheet;
declare const styleql: typeof createStyleQLSheet | typeof bindStyleQLSheet;

export default styleql;
