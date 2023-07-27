# Use the official Node.js 14 base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY ../package*.json ./

# Install the dependencies
RUN npm install

# Copy the application files to the container
COPY . .

# Expose the port that the backend service will listen on
EXPOSE 8090

# Start the backend service
CMD [ "npm", "start" ]
