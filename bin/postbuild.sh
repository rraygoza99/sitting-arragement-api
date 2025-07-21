#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute/default

# For JavaScript, copy the source files directly (no dist folder needed)
cp *.js ./.amplify-hosting/compute/default/
cp package.json ./.amplify-hosting/compute/default/
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules
cp .env ./.amplify-hosting/compute/default/ 2>/dev/null || true

# Create public directory if it doesn't exist
mkdir -p public
cp -r public ./.amplify-hosting/static

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json
