# # Stage 1: Build Angular App
# FROM node:18 AS build

# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm start

# # Stage 2: Serve with Nginx
# FROM nginx:alpine

# COPY --from=build /app/dist/project-name /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Stage 1: Build Angular App
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Use build instead of start

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/project-name /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80