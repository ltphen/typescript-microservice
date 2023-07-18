# Use Node.js LTS version
FROM node:lts

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the app
CMD [ "npm", "start" ]
