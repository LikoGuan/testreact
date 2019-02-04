module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'cranberries',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        DEPLOY_ENV: 'dev'
      },
      env_prod: {
        NODE_ENV: 'production',
        DEPLOY_ENV: 'prod'
      },
      env_staging: {
        NODE_ENV: 'production',
        DEPLOY_ENV: 'staging'
      },
      instances: 2,
      exec_mode: 'cluster'
    }
  ]
};
