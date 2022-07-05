docker compose up -d --remove-orphans
docker compose exec leemons-yarn-install sh installDeps.sh
docker compose logs -f
