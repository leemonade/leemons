docker compose up -d --remove-orphans --env-file ../examples/docker/.env
docker compose exec leemons-yarn-install sh installDeps.sh
docker compose logs -f
