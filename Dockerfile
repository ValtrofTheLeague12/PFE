FROM node:bullseye-slim

WORKDIR yassinethe3rd/pfe

COPY .. ./

RUN npm install

COPY . .

EXPOSE 2020

CMD ["node","API.js"]

