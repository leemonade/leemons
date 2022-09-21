leemonsReact="./packages/leemons-react"
app="/monorepo/app"
output="$app/frontend"
build="$app/build"

if [ ! -d $build ]
then
  printf "\e[1;33m[INFO]\e[0m \e[1;32mCreating build directory\e[0m\n"
  yarn workspace leemons-react leemonsFront build -a $app -o $output -b $build
  printf "\e[1;33m[INFO]\e[0m \e[1;32mBuild directory created in $leemonsReact/build\e[0m\n"
else
  printf "\e[1;33m[INFO]\e[0m \e[1;32mBuild directory already exists in $leemonsReact/build\e[0m\n"
fi

printf "\e[1;33m[INFO]\e[0m \e[1;32mRunning build\e[0m\n"
yarn workspace leemons-react leemonsFront preview -b $build
