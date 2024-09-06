FROM node:19-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY . .

RUN npm install --force

RUN npm install http-server @angular/cli -g

RUN ng build

EXPOSE 8080

CMD ["http-server", "dist/angular-frontend"]
