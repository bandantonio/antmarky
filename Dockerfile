FROM node:17.4.0-alpine3.14 as base
LABEL VERSION="1.1.0"
LABEL MAINTAINER="Anton Zolotukhin"
LABEL NAME="Antmarky is a static-site generator for Asciidoctor"

WORKDIR /antmarky
COPY package.json README.adoc ./
RUN npm i
COPY . .
RUN mkdir /antmarky/public

ENTRYPOINT [ "npm", "run" ]
CMD [ "dev" ]