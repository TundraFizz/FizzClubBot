FROM node:erbium
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --only=production
COPY . .
ARG MODE
ENV mode=$MODE
RUN if [ "$MODE" = "dev" ] || [ "$MODE" = "prod" ]; then :; else echo "The environment variable \"MODE\" must be either \"dev\" or \"prod\""; exit 128; fi
CMD npm run api_prod
EXPOSE 80
