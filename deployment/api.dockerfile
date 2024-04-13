# FROM prosjekt_base:$(git rev-parse HEAD)

RUN node_modules/.bin/nx run api:build

WORKDIR /app

COPY --from=builder /app/dist/apps/api .

RUN corepack enable
RUN yarn install --frozen-lockfile

CMD ["main.js"]


