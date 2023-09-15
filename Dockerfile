FROM node:20-alpine

ARG PLUGIN_NAME
ARG PLUGIN_PATH=./plugins/leemons-plugin-${PLUGIN_NAME}/backend

RUN mkdir /app
WORKDIR /app

COPY ${PLUGIN_PATH}/package*.json ./
RUN npm install --production

COPY ${PLUGIN_PATH}/ ./

RUN yarn add @leemons/runner --production
RUN yarn add nats --production

EXPOSE 3000

CMD ["yarn", "leemons-runner"]
