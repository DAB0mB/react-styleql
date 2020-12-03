var core = require('./lib');
var bindStyleQLSheet = core.bindStyleQLSheet;

var handlers = {
  createProps($node) {
    if (!Object.keys($node.style).length) {
      return $node.props;
    }

    var style = Object.entries($node.style).reduce(function (style, entry) {
      var key = entry[0];
      var value = entry[1];

      style[key] = value;

      return style;
    }, {});

    return Object.assign({},
      $node.props,
      style
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
