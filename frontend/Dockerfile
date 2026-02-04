# Use official Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and lock file first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Expose Vite's dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]