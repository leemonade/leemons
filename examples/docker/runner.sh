#!/bin/sh

cd /leemons
SED_ARG="'s/apiUrl = undefined/apiUrl = \"${1}\"/g'"
eval sed -i "$SED_ARG" index.html

serve -p 3000 -s .