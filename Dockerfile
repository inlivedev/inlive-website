FROM klakegg/hugo:0.93.2-ext
RUN npm install
RUN hugo server --gc
