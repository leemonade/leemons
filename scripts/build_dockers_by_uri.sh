#!/bin/bash

# Verifica si la carpeta es un directorio
  if [ -d $1 ]; then
    # Cambia al directorio
    cd $1

    # Extrae el nombre del directorio actual para usarlo como nombre de la imagen
    image_and_ecr_name=$(echo "$1" | awk -F'/' '{print $(NF-1)}' | sed 's/^leemons-plugin-//')

    # Comprobamos si existe archivo Dockerfile
    if [ -e Dockerfile ]; then
       # Construye la imagen de Docker
      docker build -t $image_and_ecr_name .
      # Vuelve al directorio original
      cd -
    else
      # Vuelve al directorio original
      cd -
      # Construye la imagen de Docker usando el Dockerfile generico
      docker build --build-arg PLUGIN_NAME=$image_and_ecr_name -t $image_and_ecr_name .
    fi

  else
    echo "La carpeta '$1' no es un directorio válido."
  fi
