FROM node:16.13.1

ARG NPM_TOKEN

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build; rm -f .npmrc

EXPOSE 1111

CMD npm run start:prod
