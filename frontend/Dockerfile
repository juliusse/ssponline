FROM node:14.15.5-alpine
ARG APP_URL

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV REACT_APP_URL $APP_URL

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# build app
COPY . ./
RUN npm run build

# start app
RUN npm install -g serve
ENTRYPOINT ["serve", "-s", "build"]
