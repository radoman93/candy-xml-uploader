# frontend/Dockerfile
# Stage 1: Build the Angular application
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:1.19
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
