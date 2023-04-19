FROM node:16-alpine
RUN apk update && apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++
WORKDIR /leemons
COPY ./build .
COPY ./runner.sh ./runner.sh
RUN npm install -g serve
CMD sh /leemons/runner.sh ${API_URL}
EXPOSE 3000