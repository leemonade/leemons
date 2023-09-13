#!/bin/bash

# Paso1. Verifica si se proporcionó NODE_AUTH_TOKEN como argumento
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo "Por favor, proporciona la variable de entorno NODE_AUTH_TOKEN."
  exit 1
fi

# Paso2. Verifica que se haya proporcionado al menos una ruta como argumento
if [ $# -lt 1 ]; then
  echo "Uso: $0 [rutas] [tag (opcional)]"
  exit 1
fi

# Paso 3. Obtiene el último argumento como la etiqueta (tag) o usa "latest" si no se proporciona
tag="${!#}"
if [ -z "$tag" ]; then
  tag="latest"
fi

# Paso4. Verifica si la etiqueta es válida
if [[ ! "$tag" =~ ^[0-9a-zA-Z-]+$ ]]; then
  echo "La etiqueta debe consistir solo en caracteres alfanuméricos y guiones."
  exit 1
fi

# Paso5. Itera sobre las rutas proporcionadas, excluyendo la etiqueta
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

    # Obtiene el nombre y la versión del paquete
    pkg_name=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
    pkg_version=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

    # Busca y reemplaza la versión en todos los archivos package.json donde el nombre del paquete aparece como una dependencia
    find . -name package.json -exec sed -i "s/\"$pkg_name\": \"[^\"]*\"/\"$pkg_name\": \"$pkg_version\"/g" {} \;

    # Vuelve al directorio original
    cd -
  else
    echo "La ruta '$ruta' no es un directorio válido."
  fi
done
