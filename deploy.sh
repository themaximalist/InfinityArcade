#!/bin/bash

APP_NAME="infinityarcade.com"

# Check if the first argument is "--deploy"
if [[ $1 == "--deploy" ]]; then
  FORCE_DEPLOY=true
else
  FORCE_DEPLOY=false
fi

UPDATES=$(git pull)

# Check if updates are found or if forced to deploy
if [[ $UPDATES != *"Already up to date"* ]] || [[ $FORCE_DEPLOY == true ]]; then
  npm install

  if pm2 list | grep -q $APP_NAME; then
    pm2 restart $APP_NAME
  else
    pm2 start src/server.js --name $APP_NAME
  fi
else
  echo "No updates found. Nothing to do."
fi

