FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY core ./core
COPY ee ./ee
COPY ui ./ui
RUN npm link
EXPOSE 9091
ENTRYPOINT ["promptarmor"]
CMD ["serve", "9091"]
