#!/usr/bin/env bash

cd backend/
docker build --no-cache . -t vantaa-culture-reservations-backend:latest
cd ..
docker build --no-cache . -t vantaa-culture-reservations:latest