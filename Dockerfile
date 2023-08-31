FROM node:16-alpine
RUN apk update && apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++
WORKDIR /leemons
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./packages ./packages
COPY ./examples/docker ./app
RUN yarn install --production \
    && apk del build-dependencies
WORKDIR /leemons/app
RUN rm -f ./.env
RUN rm -rf ./logs
RUN printf "cd /leemons/app \nyarn start & \nwait -n \nexit $?" >> /leemons/runner.sh
CMD [ "sh", "/leemons/runner.sh" ]
EXPOSE 8080