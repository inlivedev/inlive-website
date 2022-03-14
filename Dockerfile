FROM klakegg/hugo:latest 
WORKDIR /app
COPY . .
RUN hugo server --gc
