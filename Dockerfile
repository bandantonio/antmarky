FROM node:17.4.0-alpine3.14 as build
LABEL VERSION="1.0.0"
LABEL MAINTAINER="Anton Zolotukhin"
LABEL NAME="Antmarky is a static-site generator for Markdown"

WORKDIR /antmarky
COPY package.json server.js README.md ./
RUN npm i
COPY . .

FROM node:17.4.0-alpine3.14
COPY --from=build /antmarky /antmarky
RUN mkdir /antmarky/public
WORKDIR /antmarky

ENTRYPOINT [ "npm", "run" ]
CMD [ "serve" ]