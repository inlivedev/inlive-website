FROM ubuntu:20.04
RUN apt-get update
RUN apt-get install git curl build-essential -y
RUN export PATH=/usr/local/bin:$PATH
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
RUN echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /root/.profile
RUN eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
RUN brew install gcc
RUN brew install hugo
