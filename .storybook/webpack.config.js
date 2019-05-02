const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
const devWebpackConfig = require('../config/webpack.config.dev.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);
  config.module.rules =  devWebpackConfig.module.rules;
  return config;
};
