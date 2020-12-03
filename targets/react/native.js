var core = require('./lib');
var bindStyleQLSheet = core.bindStyleQLSheet;

var handlers = {
  createProps($node) {
    if (!Object.keys($node.style).length) {
      return $node.props;
    }

    return Object.assign({},
      $node.props,
      {
        style: [$node.style].concat($node.props.style).filter(Boolean)
      }
    );
  }
};

function styleql() {
  if (arguments[0] instanceof Array) {
    return bindStyleQLSheet(React.Fragment, handlers).apply(null, arguments);
  }

  return bindStyleQLSheet(arguments[0], handlers);
};

module.exports = Object.assign(styleq, core);
