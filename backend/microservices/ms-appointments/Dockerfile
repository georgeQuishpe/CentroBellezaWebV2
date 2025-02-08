FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5003
RUN chown -R node /usr/src/app
RUN rm -rf node_modules package-lock.json
RUN npm install
USER node
CMD ["npm", "start"]
