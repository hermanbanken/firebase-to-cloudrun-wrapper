FROM node:alpine3.12
WORKDIR /src
COPY public/dist ./public
ADD functions ./
ADD cloudrun ./
RUN npm ci
ENV dummy_config=foobar port=8080
CMD ["node", "cloudrun.js"]
