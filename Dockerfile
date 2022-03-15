FROM ubuntu:20.04
RUN apt update
RUN apt install curl -y
RUN curl -L https://github.com/gohugoio/hugo/releases/download/v0.56.0/hugo_extended_0.56.0_Linux-64bit.tar.gz|tar -xz
RUN ./hugo -s ./ --minify
