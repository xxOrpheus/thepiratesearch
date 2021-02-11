apibay expressjs/nodejs -- currently processes server side but will eventually move towards client, just need to separate the two

must create your own certificate using certbot

default config is 6996 for http and 6969 for https

these can be routed using iptables to port 80 


usage is pretty standard

npm install

then 

forever start app.js

ez
