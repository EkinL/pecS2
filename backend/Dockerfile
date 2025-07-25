FROM node:18

WORKDIR /app

COPY package*.json ./

COPY .env ./

RUN npm install

COPY . .
COPY fixtures ./fixtures

EXPOSE 3000

CMD ["npm", "run"]
