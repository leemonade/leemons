FROM node:20-alpine

ARG PLUGIN_NAME
ARG PLUGIN_PATH=./plugins/leemons-plugin-${PLUGIN_NAME}/backend

RUN mkdir /app
WORKDIR /app

COPY ${PLUGIN_PATH}/package.json ./
RUN yarn install --production
RUN yarn add @leemons/runner@latest nats --production

RUN mkdir /temp
RUN cp package.json yarn.lock /temp

COPY ${PLUGIN_PATH}/ ./

RUN cp /temp/package.json /temp/yarn.lock .

EXPOSE 3000

CMD ["yarn", "leemons-runner"]
