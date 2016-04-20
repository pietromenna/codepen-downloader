#!/bin/bash

rm -Rf example
mkdir example
node bin/cli.js download /toniwonkanobi/pen/PNzdVr example
google-chrome example/index.html
