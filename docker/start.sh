# EN: Firstly we need to create the monorepo yarn.lock, if not, docker will
#     create a directory
# ES: Primero tenemos que crear el yarn.lock del monorepo, si no, docker crea un
#     directorio
# https://github.com/leemonade/leemons/issues/5
if [ ! -f ../examples/docker/monorepo_yarn.lock ]
then
    touch ../examples/docker/monorepo_yarn.lock
    sleep 1
fi

docker compose run leemons-yarn-install sh ./installDeps.sh

docker compose --env-file ../examples/docker/.env up --remove-orphans
