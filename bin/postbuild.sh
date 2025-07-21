#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute

# For JavaScript, copy the source files directly (no dist folder needed)
cp -r ./*.js ./.amplify-hosting/compute/default/
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules
cp package.json ./.amplify-hosting/compute/default/
cp .env ./.amplify-hosting/compute/default/ 2>/dev/null || true

# Create public directory if it doesn't exist
mkdir -p public
cp -r public ./.amplify-hosting/static

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json
