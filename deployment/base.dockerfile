FROM node:lts-alpine3.18 as deps

WORKDIR /app

COPY package.json .
COPY yarn.lock .

# enable yarn
RUN corepack enable
# install deps, keep lockfile
RUN yarn install --frozen-lockfile

FROM node:lts-alpine3.18 as base

WORKDIR /app

COPY . .

COPY --from=deps /app .
