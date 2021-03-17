# Set the base image to node:12-alpine
FROM node:12-alpine as build

# Specify where our app will live in the container
WORKDIR /app

# Copy the React App to the container
COPY . /app/

# Prepare the container for building React
RUN yarn install
# We want the production version
RUN yarn run build

# Prepare nginx
FROM nginx:1.16.0-alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./public /usr/share/nginx/html/public
COPY --from=build /app/dist /usr/share/nginx/html

# Fire up nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
