FROM node:lts-alpine3.18 as deps

RUN node_modules/.bin/nx run api:build

WORKDIR /app

COPY --from=builder /app/dist/apps/api .

RUN corepack enable
RUN yarn install --frozen-lockfile

CMD ["main.js"]


