FROM node:16-alpine
RUN apk update && apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++
WORKDIR /leemons
COPY ./build .
RUN npm install -g serve
RUN sed -i 's/apiUrl = undefined/apiUrl = "${API_URL}"/g' index.html > index2.html
RUN rm index.html
RUN mv index2.html index.html
CMD [ "serve -p 3000 -s /leemons" ]
EXPOSE 3000