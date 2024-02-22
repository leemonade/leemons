FROM node:20-alpine

RUN apk add --update python3 make g++ linux-headers

RUN mkdir /app
RUN mkdir -p /app/apps/dev
RUN mkdir /app/packages
RUN mkdir /app/plugins
RUN mkdir /app/private-plugins

WORKDIR /app

COPY ./package.json ./package.json

# apps/dev

COPY ./apps/dev/package.json ./apps/dev/package.json
RUN sed -i '/frontend-react/d' ./apps/dev/package.json

COPY ./apps/dev/moleculer.config.js ./apps/dev/moleculer.config.js

# app

COPY ./packages /app/packages
COPY ./plugins /app/plugins
COPY ./private-plugins /app/private-plugins

RUN rm -rf plugins/*/frontend
RUN rm -rf private-plugins/*/frontend

# # install node deps
RUN yarn --cwd ./apps/dev install --production
RUN yarn --cwd ./apps/dev add nats jaeger-client --production
RUN yarn --production

EXPOSE 3000

CMD ["yarn", "--cwd", "./apps/dev", "leemons-runner", "services/**/*.service.js"]
