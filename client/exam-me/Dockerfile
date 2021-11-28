FROM nginx:1.21.4
WORKDIR /app

COPY . /app

RUN mv /app/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g npm@latest

#ENVIRONNEMENT
ENV NODE_PATH=/app/node_modules

# INSTALL VUE & ELECTRON
RUN npm install -g @vue/cli

RUN npm install
RUN npm run build

RUN rm -rf /usr/share/nginx/html/*
RUN cp -r ./dist/* /usr/share/nginx/html/

EXPOSE 80