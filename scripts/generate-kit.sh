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
./scripts/generate-dev-bundle.sh
./meteor --help
cd $DEVKIT_DIR

# Prepare Demeteorizer
git clone https://github.com/onmodulus/demeteorizer.git
cd demeteorizer
git checkout v2.0.4
npm install
cd $DEVKIT_DIR

# Prepare native module
# Prepare AllJoyn
# Prepare Qemu

# Finish



