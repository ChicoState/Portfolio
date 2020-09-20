FROM node:12

WORKDIR /server
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install -g nodemon --save