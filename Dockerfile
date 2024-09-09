FROM node:19-alpine

WORKDIR /usr/src/app

COPY ./angular-frontend ./angular-frontend

COPY ./express-backend ./express-backend

RUN cd angular-frontend/ && npm run install-all

RUN cd express-backend/ && npm run requirements

ENV PROD=true

RUN cd angular-frontend/ && ng build --configuration production

RUN cd express-backend/ && npm run build

RUN mv express-backend/.env ./.env

CMD ["node", "express-backend/dist/index.js"]

EXPOSE 3001


# COPY package.json .

# COPY . .

# RUN npm install --force

# RUN npm install http-server @angular/cli -g

# RUN ng build

# COPY package.json .

# COPY package-lock.json .

# COPY . .

# RUN npm run requirements

# COPY .env .

# EXPOSE 3001

# RUN npm run build

# CMD ["node", "dist/index.js"]