FROM node:latest
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g serve

# Copy the remaining application files to the container
COPY . .

# Build the application
ARG ENV_NAME
RUN npm run build:$ENV_NAME

EXPOSE 3000

# Set the command to run when the container starts
CMD serve -s build
