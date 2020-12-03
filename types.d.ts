export type $Node = {
  type: any;
  props: { [key: string]: any };
  classNames: string[];
  style: { [key: string]: any };
  children: $Node[];
};

export type Filter = {
  type: '.' | '#' | '[]' | '*' | '&';
  isNegative: boolean;
};

export type ClassFilter = Filter & {
  type: '.';
  className: string;
};

export type IndexFilter = Filter & {
  type: '#';
  index: number;
};

export type AnyFilter = ClassFilter | IndexFilter | PropFilter | AllFilter | SelfFilter;

export type PropFilter = Filter & {
  type: '[]';
  key: string;
  value?: any;
};

export type AllFilter = Filter & {
  type: '*';
};

export type SelfFilter = Filter & {
  type: '&';
};

export type Specifier = {
  type: '>' | '*' | '|';
};

export type DirectSpecifier = Specifier & {
  type: '>';
};

export type AllSpecifier = Specifier & {
  type: '*';
};

export type FilterSpecifier = Specifier & {
  type: '|';
  filters: AnyFilter[];
};

export type AnySpecifier = DirectSpecifier | AllSpecifier | FilterSpecifier;

export type Node = {
  new(): Node;
};

export type QueryNode = Node & {
  specifiers: AnySpecifier[];
  select($node: Node, specifiers: QueryNode['specifiers']): Set<$Node>;
};

export type SelectorNode = Node & {
  queries: QueryNode[];
  select($node: Node): Set<$Node>;
};

export type BlockNode = Node & {
  selector: SelectorNode;
  childBlocks: BlockNode[];
  rules: { [key: string]: any };
  applyStyles($node: Node, theme: { [key: string]: any }): void;
};

export type Cursor = {
  new(str: string): Cursor;
  pos: number;
  str: string;
  value: string | undefined;
  done: boolean;
  offset(n: number): string | undefined;
  next(): IteratorResult<string | undefined>;
  nextIf(pattern: string): boolean;
  nextWhile(pattern: string | RegExp, result: IteratorResult<string | undefined>): string;
};

export type Parser = {
  new(cursor: Cursor, params: any[]);
  cursor: Cursor;
  params: any[];
  parseBlock(): BlockParser;
  parseSelector(): SelectorParser;
  parseQuery(): QueryParser;
  parseParam(literal: string): any;
};

export type BlockParser = Parser & {
  parse(): BlockNode;
  parseRule(): { key: string, value: any };
  parseKey(): string;
  parseValue(): any;
};

export type SelectorParser = Parser & {
  parse(): SelectorNode;
};

export type QueryParser = Parser & {
  parse(): QueryNode;
  parseFilter(): AnyFilter;
};
