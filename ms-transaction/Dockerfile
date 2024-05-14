FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

COPY . .
