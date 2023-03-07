#!/bin/sh

cd /leemons
SED_ARG="'s/apiUrl = undefined/apiUrl = \"${1}\"/g'"
eval sed "$SED_ARG" index.html > index2.html
rm index.html
mv index2.html index.html

serve -p 3000 -s .