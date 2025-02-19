#using a base image which is nodejs
FROM node:20.11.1-alpine

# Set the working directory inside the container
WORKDIR /home/node/authapp

COPY package*.json ./

RUN npm install  

# Copy the rest of the application code
COPY . .
# Build the application
RUN npm run build


EXPOSE 3000

CMD ["npm", "start"]