#!/bin/bash

export PORT=5000

./prepare-docker-env.sh
node apps/root/server.js

# yarn start --filter=root
