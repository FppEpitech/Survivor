FROM node:19-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY package-lock.json .

COPY . .

RUN npm run requirements

COPY .env .

EXPOSE 3001

RUN npm run build

CMD ["node", "dist/index.js"]