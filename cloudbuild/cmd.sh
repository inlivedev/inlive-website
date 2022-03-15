#!/bin/sh

set -uxe

cache_warmup() {
  docker pull ${_SITE_IMG_LATEST} || exit 0
}

hugo_compile() {
  curl -L https://github.com/gohugoio/hugo/releases/download/v0.56.0/hugo_extended_0.56.0_Linux-64bit.tar.gz|tar -xz
  ./hugo -s ./ --minify
}

image_build() {
  docker build \
    --cache-from ${_SITE_IMG_LATEST} \
    --build-arg SITE=inlive-website \
    -t ${_SITE_IMG} \
    -t ${_SITE_IMG_LATEST} \
    -f nginx/nginx.Dockerfile \
    .
}

image_push() {
  docker push ${_SITE_IMG}
}

site_image_build() {
  cache_warmup
  # with hugo
  test -f ./config.toml && hugo_compile
  image_build
  image_push
}

site_cloud_run_deploy() {
  gcloud -q beta \
    run deploy $CLOUD_RUN_PROJECT_NAME \
      --platform managed \
      --region asia-southeast2 \
      --image ${_SITE_IMG}
}

$@
