# Use the official lightweight Nginx image
FROM nginx:alpine

# Remove the default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy website files
COPY . /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user with UID/GID 10001
RUN addgroup -g 10001 -S tampedu && \
    adduser -u 10001 -S -D -H -s /sbin/nologin -G tampedu tampedu

# Give the non-root user ownership of required directories
RUN chown -R 10001:10001 \
    /usr/share/nginx/html \
    /var/cache/nginx \
    /var/log/nginx \
    /etc/nginx \
    /run

# Run Nginx as non-root
USER 10001:10001

# Nginx will listen on 8080
EXPOSE 8080

# Container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]