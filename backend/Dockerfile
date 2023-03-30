# Use node.js
FROM node:latest

# Creating an application directory
RUN mkdir -p /usr/src/app

# Installing dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# copying the source code
COPY . .

# Server start
CMD [ "npm", "start" ]