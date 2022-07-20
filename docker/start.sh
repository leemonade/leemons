if [ ! -f ../examples/docker/monorepo_yarn.lock ]
then
    touch ../examples/docker/monorepo_yarn.lock
    docker compose run leemons-yarn-install sh installDeps.sh
fi
docker compose --env-file ../examples/docker/.env up -d --remove-orphans
docker compose exec leemons-yarn-install sh installDeps.sh
docker compose logs -f
