leemonsReact="./packages/leemons-react"
app="/monorepo/app"

if [ ! -d  $leemonsReact/build ]
then
  printf "\e[1;33m[INFO]\e[0m \e[1;32mCreating build directory\e[0m\n"
  yarn workspace leemons-react build $app
  printf "\e[1;33m[INFO]\e[0m \e[1;32mBuild directory created in $leemonsReact/build\e[0m\n"
else
  printf "\e[1;33m[INFO]\e[0m \e[1;32mBuild directory already exists in $leemonsReact/build\e[0m\n"
fi

printf "\e[1;33m[INFO]\e[0m \e[1;32mRunning build\e[0m\n"
yarn workspace leemons-react serve
