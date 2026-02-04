# Use official Node image
FROM node:20

# Set working directory
WORKDIR /app

# Now that this file is in the root, it looks for package.json in the root
COPY package*.json ./
RUN npm install
COPY . .

# Expose Vite's dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]