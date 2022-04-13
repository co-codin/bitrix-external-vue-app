FROM node:12.19-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN npm install

EXPOSE 8000

#CMD ["npm", "run", "serve"]
CMD ["sleep", "100000"]
