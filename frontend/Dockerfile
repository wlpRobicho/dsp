# Stage 1: Build Angular App
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/project-name /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
