#!/bin/bash

# Paso1. Verifica que se haya proporcionado al menos un string como argumento
BASE_PATH=$(pwd)
PLUGINS_PATH="$1"
IFS=',' read -ra PACKAGES <<< "$2"
IFS=',' read -ra PLUGINS <<< "$3"

cd "$PLUGINS_PATH"

if [ ${#PACKAGES[@]} -gt 0 ]; then
  for string in "${PACKAGES[@]}"
  do
    # Separa el nombre de la dependencia y la versión
    IFS='|' read -ra DEP <<< "$string"
    dep_name=${DEP[0]}
    dep_version=${DEP[1]}

    # Actualizamos todos los package.json a la nueva version del paquete
    find . -name 'node_modules' -prune -o -name 'package.json' -exec sed -i "" "s|\"$dep_name\": \"[^\"]*\"|\"$dep_name\": \"$dep_version\"|g" {} \;

    dependent_plugins=$(find */backend/* -name 'package.json' -not -path "*/node_modules/*" -exec grep -l "$dep_name" {} \;)

    for dependent_plugin in $dependent_plugins
      do
        # Split the path into an array using '/' as delimiter
        IFS='/' read -ra ADDR <<< "$dependent_plugin"
        # Only pass the first directory of each URL
        plugin_name="${ADDR[0]}"
        # Add $plugin_name to PLUGINS if it doesn't already exist
        if [[ ! " ${PLUGINS[@]} " =~ " ${plugin_name} " ]]; then
            PLUGINS+=("$plugin_name")
        fi
    done
  done
fi

# Paso2. Recorre todos los PLUGINS y sube la version patch del plugin/backend/package.json
new_plugins_versions=() # New variable to store the plugins and their new versions
if [ ${#PLUGINS[@]} -gt 0 ]; then
  for plugin in "${PLUGINS[@]}"
  do
    # Navega al directorio del plugin
    cd $plugin/backend
    # Obtiene la versión actual del package.json
    current_version=$(grep -o '"version": "[^"]*' package.json | cut -d'"' -f4)
    # Separa la versión en major, minor y patch
    IFS='.' read -ra VERSION <<< "$current_version"
    major=${VERSION[0]}
    minor=${VERSION[1]}
    patch=${VERSION[2]}
    # Incrementa la versión patch
    patch=$((patch+1))
    # Construye la nueva versión
    new_version="$major.$minor.$patch"
    # Actualiza la versión en el package.json del plugin
    sed -i "s|\"version\": \"[^\"]*\"|\"version\": \"$new_version\"|g" ./package.json
    # Actualiza la versión del plugin en apps/dev/package.json
    sed -i "s|\"$plugin\": \"[^\"]*\"|\"$plugin\": \"$new_version\"|g" $BASE_PATH/apps/dev/package.json

    # Vuelve al directorio original
    cd - > /dev/null

    # Add the plugin and its new version to the new variable
    new_plugins_versions+=("$plugin|$new_version")
  done
fi

cd - > /dev/null

echo $(IFS=,; echo "${new_plugins_versions[*]}")

