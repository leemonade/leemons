FROM node:16-alpine
RUN apk update && apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++
WORKDIR /leemons
COPY ./build .
RUN yarn install -g serve
CMD [ "sh", "sed -i 's/apiUrl = undefined/\apiUrl = \"${apiUrl}\"/g' index.html > index2.html && rm index.html && mv index2.html index.html && serve -p 3000 -s /leemons" ]
EXPOSE 3000