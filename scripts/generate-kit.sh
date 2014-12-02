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
git checkout jubo-devel 
npm install
cd $DEVKIT_DIR

# Prepare node modules 
cd "../$DEVKIT_DIR"
mkdir -p node_modules
cd node_modules
git clone https://github.com/mscdex/ssh2.git
cd ssh2
git checkout v0.3.6
npm install
cd -
npm install underscore
cd $DEVKIT_DIR

# Prepare jubo binary lib
wget -c -O jubo-r0.1.0.tar.gz "http://121.14.247.123/share.php?method=Share.download&cqid=3f5b32c8fc1f734825f6f401b9599ee3&dt=63.50073adcc69132c815acc7b7ca6db56e&e=1417501943&fhash=b359339baf0f9698468c7d21c77312cebe7e2f43&fname=jubo-r0.1.0.tar.gz&fsize=3657527&nid=14173283704959675&scid=63&st=cb7b7a81e6771acb3a6ccad9ed22b026&xqid=1346557514" 

# Prepare native module
# Prepare AllJoyn
# Prepare Qemu

# Finish
cd $WORK_DIR  
sudo ln -s "$WORK_DIR/jubo" "/usr/local/bin/jubo"  
echo "Generate kit finish."


