echo 'start to deploy ......'
echo $TRAVIS_COMMIT > version.txt

# zip all files
zip -rq build.zip * .*
openssl aes-256-cbc -K $encrypted_96edf43aada8_key -iv $encrypted_96edf43aada8_iv -in .travis/github_deploy_key.enc -out production-main.pem -d

if [[ $TRAVIS_BRANCH == 'develop' ]]
then
    DEPLOY_HOST=47.91.155.75
    DEPLOY_ENV='dev'

elif [[ $TRAVIS_BRANCH == 'release' ]]
then
    DEPLOY_HOST=47.89.21.110
    DEPLOY_ENV='staging'

elif [[ $TRAVIS_BRANCH == 'master' ]]
then
    DEPLOY_HOST=47.52.67.166
    DEPLOY_ENV='prod'
fi

echo "DEPLOY_HOST $DEPLOY_HOST"
echo "DEPLOY_ENV $DEPLOY_ENV"


chmod 400 production-main.pem
scp -i production-main.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -r  build.zip root@${DEPLOY_HOST}:/root
ssh -i production-main.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q root@${DEPLOY_HOST} 'bash -s' < .travis/remote-${DEPLOY_ENV}.sh

rm -f production-main.pem

echo 'done!'

exit 0
