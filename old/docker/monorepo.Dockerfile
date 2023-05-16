# Use the lightest linux distro
FROM node:16-alpine
WORKDIR /monorepo/app
COPY ./src/package.json /monorepo/package.json
COPY ./src/.yarnrc /monorepo/.yarnrc
CMD [ "sh", "-c", "yarn --cwd .. -s; yarn dev" ]
