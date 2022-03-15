FROM klakegg/hugo:0.93.2-ext-ci AS hugo
WORKDIR /src
COPY . .
RUN npm install
RUN hugo server --gc
