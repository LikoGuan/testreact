const webpack = require('webpack');

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.DEPLOY_ENV': JSON.stringify(process.env.DEPLOY_ENV),
      })
    );

    return config;
  },
};
