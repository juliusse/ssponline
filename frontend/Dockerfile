# production environment
FROM nginx:1.27-alpine

COPY ./dist /usr/share/nginx/html
COPY nginx/conf/* /etc/nginx/conf.d/
COPY nginx/templates/template-variables.conf /etc/nginx/templates/10-variables.conf.template
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
