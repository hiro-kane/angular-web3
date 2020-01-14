FROM node:10.15

RUN npm install -g @angular/cli
WORKDIR /opt
RUN git clone https://github.com/hiro-kane/angular-web3.git
