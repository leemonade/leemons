#!/bin/bash

# Paso1. Verifica si se proporcionó NODE_AUTH_TOKEN como argumento
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo "Por favor, proporciona la variable de entorno NODE_AUTH_TOKEN."
  exit 1
fi

# Paso2. Verifica que se haya proporcionado al menos una ruta como argumento
if [ $# -lt 1 ]; then
  echo "Uso: $0 [carpeta]"
  exit 1
fi

# Paso 3. Verifica si se proporcionó NPM_TAG como argumento
if [ -z "$NPM_TAG" ]; then
  echo "Por favor, proporciona la variable de entorno NPM_TAG."
  exit 1
fi

# Paso4. Verifica si NPM_TAG es válida
if [[ ! "$NPM_TAG" =~ ^[0-9a-zA-Z-]+$ ]]; then
  echo "NPM_TAG debe consistir solo en caracteres alfanuméricos y guiones."
  exit 1
fi

# Iterar sobre las carpetas dentro de la carpeta proporcionada
for carpeta in "$1"/*/
do
  # Verifica si la carpeta es un directorio
  if [ -d "$carpeta" ]; then
    # Cambia al directorio
    cd "$carpeta"


    # Ejecuta el comando npm version
    npm version patch --legacy-peer-deps

    # Configura la variable de entorno NODE_AUTH_TOKEN
    export NODE_AUTH_TOKEN="$NODE_AUTH_TOKEN"

    # Publica el paquete
    npm publish --tag "$NPM_TAG"

    # Obtiene el nombre y la versión del paquete
    pkg_name=$(cat package.json | grep '"name":' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
    pkg_version=$(cat package.json | grep '"version":' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

    # Vuelve al directorio original
    cd -

    # Busca y reemplaza la versión en todos los archivos package.json donde el nombre del paquete aparece como una dependencia
    find . -name 'node_modules' -prune -o -name 'package.json' -exec sed -i "s|\"$pkg_name\": \"[^\"]*\"|\"$pkg_name\": \"$pkg_version\"|g" {} \;
  else
    echo "La carpeta '$carpeta' no es un directorio válido."
  fi
done

