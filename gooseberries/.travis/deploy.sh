#!/bin/bash

echo "start to deploy ......"

openssl aes-256-cbc -K $encrypted_40a517a3293f_key -iv $encrypted_40a517a3293f_iv -in .travis/production-main.pem.enc -out production-main.pem -d

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
rsync -azvh -e "ssh -i production-main.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --exclude=index.html build/ root@${DEPLOY_HOST}:~/spotpay/
rsync -azvh -e "ssh -i production-main.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" build/index.html root@${DEPLOY_HOST}:~/spotpay/index.html
# scp -i production-main.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -r build/. root@${DEPLOY_HOST}:~/spotpay/
rm -f production-main.pem

echo "done!"

exit 0