#!/usr/bin/env bash
. ./build-docker.sh
docker tag vantaa-culture-reservations:latest registry.heroku.com/vantaa-golden-eagle/web:latest
heroku container:login
docker push registry.heroku.com/vantaa-golden-eagle/web
heroku container:release web --app vantaa-golden-eagle