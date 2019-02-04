#!/bin/bash

#exit when any error
set -e

echo "run shell"

APP_NAME='staticpay'
GIT_BRANCH=$(git symbolic-ref -q HEAD)
BACKUP="${APP_NAME}_backup"

echo "target git branch: $GIT_BRANCH"

echo "start to npm install ......"

yarn install

echo "start to npm build ......"

#remove old build folder to prevent upload to wrong server
rm -rf build $APP_NAME.zip

if [ $GIT_BRANCH == "refs/heads/release" ]; then
    npm run build:staging || { echo 'build failed'; exit 1; }
elif [ $GIT_BRANCH == "refs/heads/master" ]; then
    npm run build:prod || { echo 'build failed'; exit 1; }
else
	exit 1
fi

echo "start to deploy ......"

cd build && zip -r ../$APP_NAME.zip * && cd ..

chmod 400 .production-main.pem

if [ $GIT_BRANCH == "refs/heads/release" ]; then
  echo 'scp staging'

  scp -i .production-main.pem $APP_NAME.zip root@47.89.21.110:~/$APP_NAME.zip

  ssh -i .production-main.pem root@47.89.21.110 "
    rm -rf $APP_NAME-TEMP && unzip -o $APP_NAME.zip -d $APP_NAME-TEMP &&
    rm -rf $BACKUP && cp -r $APP_NAME $BACKUP &&
    rm -rf $APP_NAME && mv $APP_NAME-TEMP $APP_NAME &&
    rm $APP_NAME.zip
  "
elif [ $GIT_BRANCH == "refs/heads/master" ]; then
  echo 'scp prod'

  scp -i .production-main.pem $APP_NAME.zip root@47.52.67.166:~/$APP_NAME.zip

  ssh -i .production-main.pem root@47.52.67.166 "
    rm -rf $APP_NAME-TEMP && unzip -o $APP_NAME.zip -d $APP_NAME-TEMP &&
    rm -rf $BACKUP && cp -r $APP_NAME $BACKUP &&
    rm -rf $APP_NAME && mv $APP_NAME-TEMP $APP_NAME &&
    rm $APP_NAME.zip
  "
fi

exit 0
