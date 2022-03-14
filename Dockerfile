FROM klakegg/hugo:latest 
WORKDIR /app
COPY . .
RUN npm install
RUN hugo server --gc
