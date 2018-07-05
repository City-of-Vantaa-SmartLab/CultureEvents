#!/usr/bin/env bash
. ./build-docker.sh
docker-compose build && docker-compose up
