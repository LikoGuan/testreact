#!/bin/bash

#exit when any error
set -e

echo "target git branch: $GIT_BRANCH"

pwd

#yarn
export PATH=$PATH:/root/.nvm/versions/node/v8.1.3/bin/

echo "start to npm install ......"

yarn install

echo "start to npm build ......"

#remove old build folder to prevent upload to wrong server
rm -rf build

if [ $GIT_BRANCH == "origin/develop" ]
then
    npm run build:dev || { echo 'build failed'; exit 1; }
elif [ $GIT_BRANCH == "origin/release" ]
then
    npm run build:staging || { echo 'build failed'; exit 1; }
elif [ $GIT_BRANCH == "origin/master" ]
then
    npm run build:prod || { echo 'build failed'; exit 1; }
else 
	exit 1
fi


echo "start to deploy ......"

cd build && zip -r ../$JOB_BASE_NAME.zip * && cd ..


#ssh
#scp $JOB_BASE_NAME.zip root@${DEPLOY_HOST}:~/

#ssh
#ssh root@${DEPLOY_HOST} 'unzip -oq $JOB_BASE_NAME.zip -d $JOB_BASE_NAME'

exit 0