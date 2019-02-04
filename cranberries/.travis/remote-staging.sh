#!/bin/bash

echo 'start to build & run ......'

rm -rf pay
unzip -oq  build.zip  -d pay

cd pay
pm2 start ecosystem.config.js --env staging

echo 'done!'
exit 0