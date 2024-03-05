FROM node:alpine3.19

WORKDIR yassinethe3rd/pfe

COPY ../package*.json ./

RUN npm install

COPY . .

EXPOSE 2020

CMD ["node","API.js"]

