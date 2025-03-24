FROM node:lts-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

ENV PORT 8000

EXPOSE 8000

CMD ["yarn", "production"]