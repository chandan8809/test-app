FROM node:lts as dependencies
# FROM node:18-alpine AS dependencies
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci

FROM node:lts as builder
# FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]