#!/bin/bash

echo Preparing Docker Environment...

ENV_FILE=./.env
BASE_PATH=./apps/root/.next

DEFAULT_API_HOST="https://customer-api-gateway.dev.baseella.com"
DEFAULT_WSS_HOST="https://messaging-gateway.dev.baseella.com"
ESCAPED_DEFAULT_API_HOST=$(printf '%s\n' "$DEFAULT_API_HOST" | sed -e 's/[\/&]/\\&/g')
ESCAPED_DEFAULT_WSS_HOST=$(printf '%s\n' "$DEFAULT_WSS_HOST" | sed -e 's/[\/&]/\\&/g')

if test -f "$ENV_FILE"; then
    echo "$ENV_FILE exists, aborting..."
else
  if [ -z ${API_HOST+x} ]; then
    echo "Provide API_HOST env variable"
    exit 1
    fi

  if [ -z ${WSS_HOST+x} ]; then
    echo "Provide WSS_HOST env variable"
    exit 1
    fi

  ESCAPED_API_HOST=$(printf '%s\n' "$API_HOST" | sed -e 's/[\/&]/\\&/g')
  ESCAPED_WSS_HOST=$(printf '%s\n' "$WSS_HOST" | sed -e 's/[\/&]/\\&/g')

  DEFAULT_CUSTOMERS_HOST="http://localhost:3000"
  ESCAPED_DEFAULT_CUSTOMERS_HOST=$(printf '%s\n' "$DEFAULT_CUSTOMERS_HOST" | sed -e 's/[\/&]/\\&/g')
  ESCAPED_CUSTOMERS_HOST=$(printf '%s\n' "$CUSTOMERS_HOST" | sed -e 's/[\/&]/\\&/g')

  echo Replacing "$DEFAULT_API_HOST" with "$API_HOST"
  echo ... and "$DEFAULT_CUSTOMERS_HOST" with "$CUSTOMERS_HOST"

  if [[ $OSTYPE == 'darwin'* ]];
    then
      grep -rl "$DEFAULT_API_HOST" $BASE_PATH | xargs sed -i "" "s/$ESCAPED_DEFAULT_API_HOST/$ESCAPED_API_HOST/g"
      grep -rl "$DEFAULT_CUSTOMERS_HOST" $BASE_PATH | xargs sed -i "" "s/$ESCAPED_DEFAULT_CUSTOMERS_HOST/$ESCAPED_CUSTOMERS_HOST/g"
      grep -rl "$DEFAULT_WSS_HOST" $BASE_PATH | xargs sed -i "" "s/$ESCAPED_DEFAULT_WSS_HOST/$ESCAPED_WSS_HOST/g"
    else
      grep -rl "$DEFAULT_API_HOST" $BASE_PATH | xargs sed -i "s/$ESCAPED_DEFAULT_API_HOST/$ESCAPED_API_HOST/g"
      grep -rl "$DEFAULT_CUSTOMERS_HOST" $BASE_PATH | xargs sed -i "s/$ESCAPED_DEFAULT_CUSTOMERS_HOST/$ESCAPED_CUSTOMERS_HOST/g"
      grep -rl "$DEFAULT_WSS_HOST" $BASE_PATH | xargs sed -i "s/$ESCAPED_DEFAULT_WSS_HOST/$ESCAPED_WSS_HOST/g"
  fi

  echo "$API_HOST" replaced in:
  grep -rl "$API_HOST" $BASE_PATH

  echo ... and "$CUSTOMERS_HOST" replaced in:
  grep -rl "$CUSTOMERS_HOST" $BASE_PATH

  echo "$WSS_HOST" replaced in:
  grep -rl "$WSS_HOST" $BASE_PATH

  echo Docker Environment Ready!
fi
