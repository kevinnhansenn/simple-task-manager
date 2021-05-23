FROM node:12-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ENTRYPOINT ["yarn", "start"]
