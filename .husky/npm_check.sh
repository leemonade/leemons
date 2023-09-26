#!/bin/bash

for carpeta in "./packages"/*/
do
  cd $carpeta
  result=$(npm-check)
  if [[ $result == *"Your modules look amazing. Keep up the great work."* ]]; then
    echo "package.json looks good. (${carpeta})"
  else
    echo "package.json have errors. (${carpeta})"
    exit 1
  fi
  cd - >/dev/null
done

for carpeta in "./plugins"/*/
do
  if [ -d "${carpeta}backend" ]; then
    cd "${carpeta}backend"
    result=$(npm-check)
    if [[ $result == *"Your modules look amazing. Keep up the great work."* ]]; then
      echo "package.json looks good. (${carpeta})"
    else
      echo "package.json have errors. (${carpeta})"
      exit 1
    fi
    cd - >/dev/null
  fi
done
