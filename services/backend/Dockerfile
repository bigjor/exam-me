FROM node:16.13.0
WORKDIR /service

COPY . /service

#ENVIRONNEMENT
ENV NODE_PATH=/service/node_modules

RUN npm install
CMD [ "node", "app.js" ] 



EXPOSE 9999