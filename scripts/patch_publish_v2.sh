#!/bin/bash

# Paso1. Verifica si se proporcionó NODE_AUTH_TOKEN como argumento
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo "Por favor, proporciona la variable de entorno NODE_AUTH_TOKEN."
  exit 1
fi

# Paso2. Verifica que se haya proporcionado al menos un string como argumento
IFS=',' read -ra ADDR <<< "${1:-}"
if [ ${#ADDR[@]} -eq 0 ]; then
  echo ""
  exit 0
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

# Iterar sobre los strings proporcionados como argumentos
declare -a processed_packages
declare -a processed_packages_name


# Función para procesar un paquete
function process_package() {
  local package=$1
  # Verifica si el paquete ya ha sido procesado
  if [[ " ${processed_packages[@]} " =~ " ${package} " ]]; then
    return
  fi
  # Agrega el paquete a la lista de paquetes procesados
  processed_packages+=("$package")
  # Verifica si el paquete es un directorio
  if [ -d "$package" ]; then
    # Cambia al directorio
    cd "$package"
    # Ejecuta el comando npm version
    npm version patch --legacy-peer-deps > /dev/null 2>&1
    # Configura la variable de entorno NODE_AUTH_TOKEN
    export NODE_AUTH_TOKEN="$NODE_AUTH_TOKEN"
    # Obtiene el nombre y la versión del paquete
    pkg_name=$(cat package.json | grep '"name":' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
    pkg_version=$(cat package.json | grep '"version":' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
    processed_packages_name+=("$pkg_name|$pkg_version")
    # Vuelve al directorio original
    cd - > /dev/null
    # Busca y reemplaza la versión en todos los archivos package.json donde el nombre del paquete aparece como una dependencia
    find . -name 'node_modules' -prune -o -name 'package.json' -exec sed -i "s|\"$pkg_name\": \"[^\"]*\"|\"$pkg_name\": \"$pkg_version\"|g" {} \;
   
    # Busca paquetes que dependen de este paquete
    # Busca todos los package.json dentro de /packages que tengan la dependencia de $pkg_name
    local dependent_packages=$(find ./packages -name 'package.json' -not -path "*/node_modules/*" -exec grep -l "$pkg_name" {} \;)
    for dependent_package in $dependent_packages
    do
      # Split the path into an array using '/' as delimiter
      IFS='/' read -ra ADDR <<< "$dependent_package"
      # Only pass the first two directories of each URL
      dependent_package="${ADDR[1]}/${ADDR[2]}"
      if [ "$dependent_package" != "$package" ]; then
        process_package "$dependent_package"
      fi
    done
  else
    exit 1
  fi
}


for string in "${ADDR[@]}"
do
  # Modifica el string para que sea de la forma packages/$string
  string="packages/$string"
  process_package "$string"
done

# Publica todos los paquetes procesados
for package in "${processed_packages[@]}"
do
  cd "$package"
  npm publish --tag "$NPM_TAG" > /dev/null 2>&1
  cd - > /dev/null
done

# Imprime los paquetes procesados separados por una coma
echo $(IFS=,; echo "${processed_packages_name[*]}")

