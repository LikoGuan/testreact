#!/bin/bash

if [ $TRAVIS_BRANCH == 'develop' ]
then
    npm run build:dev
elif [ $TRAVIS_BRANCH == 'release' ]
then
    npm run build:staging
elif [ $TRAVIS_BRANCH == 'master' ]
then
    npm run build:prod
fi