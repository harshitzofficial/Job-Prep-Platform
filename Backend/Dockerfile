# Use a lightweight Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching efficiency)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your Express app runs on
EXPOSE 3000

# Start the application using your dev script (Nodemon)
CMD ["npm", "run", "dev"]