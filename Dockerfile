# FROM ubuntu:20.04
# RUN apt-get update
# RUN apt-get install git curl build-essential gcc ruby-full -y
# RUN export PATH=/usr/local/bin:$PATH
# RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# RUN echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /root/.profile
# RUN eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
# RUN brew install hugo
FROM klakegg/hugo:0.93.2-ext-ci AS hugo
RUN npm install -g npm@8.5.4
RUN npm install -D tailwindcss
RUN npm install
RUN npx tailwindcss init
WORKDIR /src
COPY . .
FROM nginx
COPY --from=hugo /target /usr/share/nginx/html
