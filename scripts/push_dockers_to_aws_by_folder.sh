#!/bin/bash

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

# Verifica si se proporcionó IMAGE_TAG como argumento
if [ -z "$IMAGE_TAG" ]; then
  echo "Por favor, proporciona la variable de entorno IMAGE_TAG."
  exit 1
fi

# Iterar sobre las carpetas dentro de la carpeta proporcionada
for carpeta in "$1"/*/
do
  # Verifica si la ruta es un directorio
    if [ -d "${carpeta}backend" ]; then

      # Extrae el nombre del directorio actual para usarlo como nombre de la imagen
      image_and_ecr_name=$(echo "$carpeta" | awk -F'/' '{print $(NF-1)}' | sed 's/^leemons-plugin-//')

      # Etiqueta la imagen docker que tiene que estar creada previamente
      docker tag $image_and_ecr_name:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$image_and_ecr_name:$IMAGE_TAG

      # Publica la imagen en AWS ECR
      docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$image_and_ecr_name:$IMAGE_TAG &

    else
      echo "La ruta '$carpeta' no es un directorio válido."
    fi
done

# Esperar a que todos los procesos en segundo plano terminen
wait


