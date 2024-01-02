FROM node:20-alpine

RUN apk add --update python3

ARG PLUGIN_NAME
ARG PATH_NAME

ARG PLUGIN_PATH=./${PATH_NAME}/leemons-plugin-${PLUGIN_NAME}/backend

RUN mkdir /app
WORKDIR /app

COPY ${PLUGIN_PATH}/package.json ./
RUN yarn install --production
RUN yarn add @leemons/runner@dev nats jaeger-client --production

RUN mkdir /temp
RUN cp package.json yarn.lock /temp

COPY ${PLUGIN_PATH}/ ./

RUN cp /temp/package.json /temp/yarn.lock .

EXPOSE 3000

CMD ["yarn", "leemons-runner"]
