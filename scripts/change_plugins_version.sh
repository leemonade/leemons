#!/bin/bash

# Paso1. Verifica que se haya proporcionado al menos una ruta como argumento
if [ $# -lt 1 ]; then
  echo "Uso: $0 [carpeta]"
  exit 1
fi

# Iterar sobre las carpetas dentro de la carpeta proporcionada
for carpeta in "$1"/*/
do
  # Verifica si la carpeta es un directorio
  if [ -d "$carpeta" ]; then
    # Cambia al directorio
    cd "$carpeta"

    # Obtiene el nombre y la versión del paquete
    pkg_name=$(cat package.json | grep '"name":' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

    # Vuelve al directorio original
    cd -

    # Busca y reemplaza la versión en todos los archivos package.json donde el nombre del paquete aparece como una dependencia
    find . -name 'node_modules' -prune -o -name 'package.json' -exec sed -i "s|\"$pkg_name\": \"[^\"]*\"|\"$pkg_name\": \"$2\"|g" {} \;
  else
    echo "La carpeta '$carpeta' no es un directorio válido."
  fi
done
