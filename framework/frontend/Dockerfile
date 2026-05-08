FROM node:20-alpine

WORKDIR /app

# We don't need expo-cli anymore for a Vite headless frontend
# Install dependencies first (better for Docker caching)
COPY package*.json ./
RUN npm install

# Copy the rest of your Vite project
COPY . .

# Vite's default dev port
EXPOSE 5173

# IMPORTANT: Vite needs --host to allow access from outside the container (your browser)
CMD ["npm", "run", "dev", "--", "--host"]