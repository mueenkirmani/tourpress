FROM node:18
WORKDIR /tourpress
COPY package*.json ./
RUN npm install --development
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
