#!/bin/bash

while getopts p:d: flag
do
    case "${flag}" in
        p) PREFIX=${OPTARG};;
        d) PATH_NAME=${OPTARG};;
    esac
done
shift $((OPTIND -1))

IFS=',' read -ra PLUGINS <<< "$1"

# Verifica si se proporcionó AWS_ACCOUNT_ID como argumento
if [ -z "$AWS_ACCOUNT_ID" ]; then
  echo "Por favor, proporciona la variable de entorno AWS_ACCOUNT_ID."
  exit 1
fi

# Verifica si se proporcionó AWS_REGION como argumento
if [ -z "$AWS_REGION" ]; then
  echo "Por favor, proporciona la variable de entorno AWS_REGION."
  exit 1
fi

if [ ${#PLUGINS[@]} -gt 0 ]; then
  for plugin_version in "${PLUGINS[@]}"
  do
    # Separa el nombre del plugin y la versión
    IFS='|' read -ra PLUGIN <<< "$plugin_version"
    plugin=${PLUGIN[0]}
    version=${PLUGIN[1]}

    if [ -d "$PATH_NAME/${plugin}/backend" ]; then

      # Extrae el nombre del directorio actual para usarlo como nombre de la imagen
      image_and_ecr_name=$(echo "$plugin" | awk -F'/' '{print $(NF-1)}' | sed 's/^leemons-plugin-//')

      if [ -n "$PREFIX" ]; then
        image_and_ecr_name=$(echo "$PREFIX-$image_and_ecr_name")
      fi

      # Etiqueta la imagen docker que tiene que estar creada previamente
      docker tag $image_and_ecr_name:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$image_and_ecr_name:$version

      # Publica la imagen en AWS ECR
      docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$image_and_ecr_name:$version
    else
      echo "La ruta '$PATH_NAME/${plugin}/backend' no es un directorio válido."
    fi
  done
fi

