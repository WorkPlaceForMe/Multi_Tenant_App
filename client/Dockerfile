FROM nginx:stable-alpine
COPY ./dist /usr/share/nginx/html
RUN mkdir usr/share/nginx/error
COPY ./error.html /usr/share/nginx/error
