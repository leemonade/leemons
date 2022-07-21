# EN: Firstly we need to create the monorepo yarn.lock, if not, docker will
#     create a directory
# ES: Primero tenemos que crear el yarn.lock del monorepo, si no, docker crea un
#     directorio
# https://github.com/leemonade/leemons/issues/5
if ( -Not (Test-Path -Path ..\examples\docker\monorepo_yarn.lock) ) {
  New-Item -Path ..\examples\docker\monorepo_yarn.lock -ItemType File
  Start-Sleep 1
}

docker compose run leemons-yarn-install sh ./installDeps.sh

docker compose --env-file ../examples/docker/.env up --remove-orphans
