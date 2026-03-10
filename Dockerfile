FROM nginx:stable-alpine

RUN rm -f /etc/nginx/conf.d/default.conf && \
    printf '%s\n' \
    'server {' \
    '    listen 80;' \
    '    server_name localhost;' \
    '    root /usr/share/nginx/html;' \
    '    index index.html;' \
    '    location / {' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '    location ~* \.json$ {' \
    '        default_type application/json;' \
    '    }' \
    '}' > /etc/nginx/conf.d/default.conf

COPY src/ /usr/share/nginx/html/

EXPOSE 80