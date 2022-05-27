FROM node:16.15-alpine as build

COPY package*.json ./
RUN ["npm", "i"]
RUN ["npm", "cache", "clean", "-f"]

COPY . .
RUN ["npm", "run", "build"]

FROM node:16.15-alpine as run

COPY --from=build package*.json ./
RUN ["npm", "i", "--only=production"]
RUN ["npm", "cache", "clean", "-f"]

COPY --from=build dist .
CMD ["node", "main.js"]
