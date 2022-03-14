FROM ubuntu
RUN apt-get update
RUN apt-get install curl -y
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
RUN brew install hugo
