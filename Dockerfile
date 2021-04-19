FROM node:12.20.2-alpine3.10

WORKDIR /url-svc

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "start:debug"]
