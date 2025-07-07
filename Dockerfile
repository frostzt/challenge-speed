FROM ubuntu:latest
LABEL authors="frostzt"

ENTRYPOINT ["node", "./build/app.js"]