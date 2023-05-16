# $0 - PATH
# $1 - Command to execute if true

sleep 3
while true; do
  if [ -f /monorepo/node_modules/DONE ]; then
    break
  fi
  sleep 5
done

# Execute command
eval "$@"
