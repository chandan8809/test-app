FROM node:lts as dependencies

WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci

FROM node:lts as builder

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]