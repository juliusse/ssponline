FROM node:14.15.5-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# build app
COPY . ./
RUN npm run build

# start app
RUN npm install -g serve
CMD ["serve", "-s", "build"]
