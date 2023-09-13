#!/bin/bash

# Verifica si se proporcionó NODE_AUTH_TOKEN como argumento
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo "Por favor, proporciona la variable de entorno NODE_AUTH_TOKEN."
  exit 1
fi

# Verifica que se haya proporcionado al menos una ruta como argumento
if [ $# -lt 1 ]; then
  echo "Uso: $0 [rutas] [tag (opcional)]"
  exit 1
fi

# Obtiene el último argumento como la etiqueta (tag) o usa "latest" si no se proporciona
tag="${!#}"
if [ -z "$tag" ]; then
  tag="latest"
fi

# Verifica si la etiqueta es válida
if [[ ! "$tag" =~ ^[0-9a-zA-Z-]+$ ]]; then
  echo "La etiqueta debe consistir solo en caracteres alfanuméricos y guiones."
  exit 1
fi

# Itera sobre las rutas proporcionadas, excluyendo la etiqueta
for ruta in "${@:1:$#-1}"
do
  # Verifica si la ruta es un directorio
  if [ -d "$ruta" ]; then
    # Cambia al directorio
    cd "$ruta"

    # Ejecuta el comando npm version
    npm version patch --legacy-peer-deps

    # Configura la variable de entorno NODE_AUTH_TOKEN
    export NODE_AUTH_TOKEN="$NODE_AUTH_TOKEN"

    # Publica el paquete
    npm publish --tag "$tag"

    # Vuelve al directorio original
    cd -
  else
    echo "La ruta '$ruta' no es un directorio válido."
  fi
done
