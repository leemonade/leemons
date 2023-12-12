#!/bin/bash

# Iterar sobre las carpetas dentro de la carpeta proporcionada
for parent_folder in "$@"
do
  for folder in "$parent_folder"/*/
  do
    bash ./scripts/build_dockers_by_uri.sh "${folder}backend"
  done
done
