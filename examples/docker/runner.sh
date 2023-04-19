#!/bin/sh

API_URL=$1
CLEAN_API_URL=${API_URL/\/\//\\/\\/}

cd /leemons
SED_ARG="'s/apiUrl = undefined/apiUrl = \"${CLEAN_API_URL}\"/g'"
eval sed -i "$SED_ARG" index.html
                  
serve -p 3000 -s .