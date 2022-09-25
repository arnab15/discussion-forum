FROM node:16-alpine3.16
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . . 

EXPOSE 4005 

CMD ["npm", "start"]