FROM node:17.4.0-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --only=prod
COPY ./ ./

CMD ["npm", "run", "dev"]