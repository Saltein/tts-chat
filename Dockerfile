# 1. Сборка React
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build  # соберёт production build в /app/build

# 2. Запуск через Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
