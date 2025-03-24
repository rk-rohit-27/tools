# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your application will use
EXPOSE 5000

# Set environment variables (Optional: Use this for production optimization)
ENV NODE_ENV=production

# Define the entry point for the container
CMD ["npm", "start"]
