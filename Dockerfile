# Use the lightest linux distro
FROM node:16-alpine
RUN apk update && apk add python3
WORKDIR /leemons
COPY ./package.json ./package.json
COPY ./packages ./packages
COPY ./examples/docker ./app
RUN yarn install
WORKDIR /leemons/app
RUN rm -f ./.env
# RUN rm -rf ./frontend
# RUN rm -rf ./build
RUN rm -rf ./logs
# RUN yarn front:build
# RUN printf "cd /leemons/app \n yarn start & \n yarn front:preview & \n wait -n \n exit $?" >> /leemons/runner.sh

RUN printf "cd /leemons/app \n yarn start & \n wait -n \n exit $?" >> /leemons/runner.sh
CMD [ "sh", "/leemons/runner.sh" ]
EXPOSE 8080
