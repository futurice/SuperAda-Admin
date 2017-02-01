# SuperAda admin

This is the admin frontend for the SuperAda event.

Backend app: https://github.com/futurice/SuperAda-Backend

Based on: [frontend-hipster-kit](https://github.com/FruitieX/frontend-hipster-kit)

## Setup

[yarn](https://github.com/yarnpkg/yarn) 0.18+ must be present on your machine.

### Install dependencies
```
yarn
```

### Start

Run webpack-dev-server, get ready to code with hot reloading
```
yarn start
```

## Share

Share your localhost running app to anyone with an internet connection
```
yarn ngrok
```

### Build

Bundle your app. It will create `index.html`, `main.[hash].js`, `vendor.[hash].js` and `manifest.[hash].js`
```
yarn build
```

### Run your build
```
yarn prod
```

### Deploy

#### [Surge.sh](http://surge.sh)
```
surge ./dist -d subdomain.surge.sh
```
