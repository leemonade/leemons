docker compose up -d
docker-compose exec leemons-yarn-install sh installDeps.sh
docker-compose logs -f
