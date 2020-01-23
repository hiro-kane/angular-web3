FROM node:10.15

RUN echo n | npm install -g @angular/cli@8.3.23
RUN npm install -g --unsafe-perm truffle@v5.1.9

WORKDIR /opt
RUN git clone https://github.com/hiro-kane/angular-web3.git

WORKDIR /opt/angular-web3