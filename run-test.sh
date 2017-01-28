#!/bin/bash
echo "Testing $1..."
PATH=$(npm bin):$PATH
browserify -t es2040 $1/test/index.js | tape-run --report='tap-spec'
