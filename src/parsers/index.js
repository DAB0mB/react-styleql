import Cursor from '../Cursor';
import { SelectorNode, QueryNode } from '../nodes';
import BlockParser from './BlockParser';

export { BlockParser };
export { default as Parser } from './Parser';
export { default as QueryParser } from './QueryParser';
export { default as SelectorParser } from './SelectorParser';

export const parseStyleQLSheet = (strs, ...pargs) => {
  const params = [...new Set(pargs)];

  const template = strs.reduce((split, str, index) => {
    split.push(str);

    const pindex = params.indexOf(pargs[index]);

    if (~pindex) {
      split.push('$' + pindex);
    }

    return split;
  }, [])
    .join('');

  const cursor = new Cursor(template, params);

  const rootQuery = new QueryNode();
  rootQuery.specifiers.push({ type: '|', filters: [{ type: '*', elementType: '&' }] });

  const rootSelector = new SelectorNode();
  rootSelector.queries.push(rootQuery);

  const rootBlock = new BlockParser(cursor, params).parse();
  rootBlock.selector = rootSelector;

  return rootBlock;
};
