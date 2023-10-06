#!/bin/bash

# Iterar sobre las carpetas dentro de la carpeta proporcionada
for carpeta in "$1"/*/
do
  bash ./scripts/build_dockers_by_uri.sh "${carpeta}backend" &
done

# Esperar a que todos los procesos en segundo plano terminen
wait
