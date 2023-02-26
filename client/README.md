# B2broker task

Websocket client is connected to server by `ws://localhost:443` url

### Installation

```bash
$ npm run init
```

```bash
$ npm i -g pm2
```

## Running the app

```bash
# local
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ pm2 start dist/src/main.js -i 4
```

## Stop the app

```bash
$ pm2 delete main
```

## Check logs

```bash
# local
$ pm2 logs
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# watch mode
$ npm run test:watch

# test coverage
$ npm run test:cov
```
