FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY web/index.html web/pago.html web/privacidad.html web/informe-ergo-capital-escudia.html web/cobertura-ergo-capital.html /usr/share/nginx/html/
COPY web/assets/ /usr/share/nginx/html/assets/
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
