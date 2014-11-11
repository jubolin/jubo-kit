#!/bin/bash

set -e
set -u

cd "`dirname "$0"`"/..
WORK_DIR=$(pwd)
DEVKIT_DIR="$WORK_DIR/devkit"
rm -rf $DEVKIT_DIR
mkdir -p $DEVKIT_DIR
cd $DEVKIT_DIR

# Prepare Meteor
git clone https://github.com/jubolin/meteor.git
cd meteor
git checkout jubo-master
wget https://d3sqy0vbqsdhku.cloudfront.net/dev_bundle_Linux_i686_0.3.61.tar.gz
./meteor create --example todos
cd todos 
../meteor --port 22786 > meteor.out &
echo "building meteor ..."
while true
do
    str=$(tail -1 meteor.out | awk '{print $3}');
    if [ "$str" = "running" ]; then
        pid=$(ps aux | grep meteor/tools/main.js | grep -v "grep" | awk '{print $2}')
        kill -9  $pid
        break
    fi
done 

cd -
rm -rf todos
cd $DEVKIT_DIR

# Prepare Demeteorizer
git clone https://github.com/jubolin/demeteorizer.git
cd demeteorizer
git checkout v2.0.4
npm install
cd $DEVKIT_DIR

# Prepare native module
# Prepare AllJoyn
# Prepare Qemu

# Finish
cd $WORK_DIR  
sudo ln -s "$WORK_DIR/jubo" "/usr/local/bin/jubo"  
echo "Generate kit finish."


