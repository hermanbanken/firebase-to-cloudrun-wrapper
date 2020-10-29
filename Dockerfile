FROM node:alpine3.12
WORKDIR /src
COPY functions/package.json functions/package-lock.json ./
RUN npm ci
ADD functions ./
ADD cloudrun ./
COPY public/dist ./public
ENV dummy_config=foobar port=8080
CMD ["node", "cloudrun.js"]
