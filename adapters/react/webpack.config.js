const path = require('path');
const merge = require('webpack-merge').default;

const config = merge(require('../../webpack.config'), {
  entry: {
    dom: path.resolve(__dirname, 'src/envs/dom'),
    native: path.resolve(__dirname, 'src/envs/native'),
    ink: path.resolve(__dirname, 'src/envs/ink'),
  },
  resolve: {
    alias: {
      '@stylejs/core': path.resolve('../../lib'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
  },
  externals: [
    '@stylejs/core',
    'react',
  ],
});

delete config.entry.index;

module.exports = config;
