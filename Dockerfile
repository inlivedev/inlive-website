FROM klakegg/hugo:0.93.2 
WORKDIR /app
COPY . .
RUN hugo server --gc
