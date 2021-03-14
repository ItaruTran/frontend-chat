FROM nginx:1.16

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./public /usr/share/nginx/html/public
COPY ./dist /usr/share/nginx/html

# Fire up nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
