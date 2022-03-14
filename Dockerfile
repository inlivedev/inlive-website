FROM klakegg/hugo:0.93.2-ext
WORKDIR /app
COPY . .
RUN hugo server --gc
