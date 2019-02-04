#!/bin/bash

#exit when any error
set -e

echo "run shell"

APP_NAME='pay'
GIT_BRANCH=$(git symbolic-ref -q HEAD)

#
# #yarn
# export PATH=$PATH:/root/.nvm/versions/node/v8.1.3/bin/
#
echo "start to npm install ......"

yarn install

echo "start to npm build ......"


if [ $GIT_BRANCH == "refs/heads/develop" ]; then
    echo 'npm run build:dev'
    npm run build:dev || { echo 'build failed'; exit 1; }
elif [ $GIT_BRANCH == "refs/heads/release" ]; then
  echo 'npm run build:staging'
    npm run build:staging || { echo 'build failed'; exit 1; }
elif [ $GIT_BRANCH == "refs/heads/master" ]; then
  echo 'npm run build:prod'
    npm run build:prod || { echo 'build failed'; exit 1; }
else
	exit 1
fi

echo "start to deploy ......"



rm -f $APP_NAME.zip

zip -r $APP_NAME.zip ./* .babelrc .eslintrc.json .eslintignore -x node_modules/\* *\.next* *\.git* *\.travis* yarn.lock yarn-error.log *\.DS_Store

BACKUP="${APP_NAME}_backup"

echo $GIT_BRANCH

chmod 400 production-main.pem

if [ $GIT_BRANCH == "refs/heads/develop" ]; then
  echo 'scp develop'
elif [ $GIT_BRANCH == "refs/heads/release" ]; then
  echo 'scp release'

  scp -i production-main.pem $APP_NAME.zip root@47.89.21.110:~/$APP_NAME.zip

	ssh -i production-main.pem root@47.89.21.110 "
    rm -rf $APP_NAME-TEMP &&
  	unzip -o $APP_NAME.zip -d $APP_NAME-TEMP &&
  	rm $APP_NAME.zip &&
    cd $APP_NAME-TEMP &&
    yarn install &&
    npm run build:staging &&
    cd .. &&
    rm -rf $BACKUP &&
    cp -r $APP_NAME $BACKUP &&
    rm -rf $APP_NAME &&
    mv $APP_NAME-TEMP $APP_NAME &&
    cd $APP_NAME &&
    pm2 start ecosystem.config.js --env staging
	"
elif [ $GIT_BRANCH == "refs/heads/master" ]; then
  echo 'scp prod'

  scp -i production-main.pem $APP_NAME.zip root@47.52.67.166:~/$APP_NAME.zip

	ssh -i production-main.pem root@47.52.67.166 "
    rm -rf $APP_NAME-TEMP &&
  	unzip -o $APP_NAME.zip -d $APP_NAME-TEMP &&
  	rm $APP_NAME.zip &&
    cd $APP_NAME-TEMP &&
    yarn install &&
    npm run build:prod &&
    cd .. &&
    rm -rf $BACKUP &&
    cp -r $APP_NAME $BACKUP &&
    rm -rf $APP_NAME &&
    mv $APP_NAME-TEMP $APP_NAME &&
    cd $APP_NAME &&
    pm2 start ecosystem.config.js --env prod
	"
fi

exit 0
