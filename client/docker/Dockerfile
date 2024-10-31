FROM nginx:alpine

# Nginxのデフォルト設定を削除し、ビルドした静的ファイルをコピー
RUN rm -rf /usr/share/nginx/html/*
COPY ../build /usr/share/nginx/html

# Nginx設定ファイルを指定
COPY nginx.conf /etc/nginx/nginx.conf

# デフォルトのポート80で起動
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]