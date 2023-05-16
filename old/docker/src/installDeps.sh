# $0 - PATH
# $1 - Command to execute if true

printf "\e[1;33m[INFO]\e[0m Installing dependencies, please, be patient\n"

if [ ! -f /monorepo/app/package.json ]; then
  cp /monorepo/appPackageTemplate.json /monorepo/app/package.json
fi

rm -rf /monorepo/node_modules/DONE
yarn install
touch /monorepo/node_modules/DONE
printf "\e[1;33m[INFO]\e[0m Dependencies installed\n"
