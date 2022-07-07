docker compose --env-file ../examples/docker/.env up -d --remove-orphans
docker compose exec leemons-yarn-install sh installDeps.sh
docker compose logs -f
