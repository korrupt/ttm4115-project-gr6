FROM node:lts-alpine3.18 as deps

WORKDIR /app

COPY package.json .
COPY yarn.lock .

# enable yarn
RUN corepack enable
# install deps, keep lockfile
RUN yarn install --frozen-lockfile

FROM node:lts-alpine3.18 as builder

WORKDIR /app

COPY --from=deps /app .
COPY . .

RUN node_modules/.bin/nx run web:server

FROM node:lts-alpine3.18 as api

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["dist/apps/web/server/main.js"]


