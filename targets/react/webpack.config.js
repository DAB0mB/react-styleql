const path = require('path');
const merge = require('webpack-merge').default;

module.exports = merge(require('../../webpack.config'), {
  entry: {
    index: path.resolve(__dirname, 'src/index'),
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
  },
  externals: [
    '@styleql/core',
    'react',
  ],
});
