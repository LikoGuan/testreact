#!/bin/bash

echo "start to deploy ......"

openssl aes-256-cbc -K $encrypted_1197957f869d_key -iv $encrypted_1197957f869d_iv -in .travis/production-main.pem.enc -out production-main.pem -d
echo $TRAVIS_COMMIT > build/version


if [[ $TRAVIS_BRANCH == 'develop' ]]
then
    DEPLOY_HOST=47.91.155.75

elif [[ $TRAVIS_BRANCH == 'release' ]]
then
    DEPLOY_HOST=47.89.21.110
   
elif [[ $TRAVIS_BRANCH == 'master' ]]
then
    DEPLOY_HOST=47.52.67.166
fi

echo "DEPLOY_HOST $DEPLOY_HOST"

chmod 400 production-main.pem
scp -i production-main.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -r  build/. root@${DEPLOY_HOST}:~/trader/
rm -f production-main.pem

echo "done!"

exit 0