#!/bin/bash

$DIRECTORY="$1"
IFS=',' read -ra PLUGINS <<< "$2"

if [ ${#PLUGINS[@]} -gt 0 ]; then
  for plugin_version in "${PLUGINS[@]}"
  do
    # Separa el nombre del plugin y la versión
    IFS='|' read -ra PLUGIN <<< "$plugin_version"
    plugin=${PLUGIN[0]}
    version=${PLUGIN[1]}

    bash ./scripts/build_dockers_by_uri.sh "${DIRECTORY}/${plugin}/backend" "$DIRECTORY"
  done
fi
