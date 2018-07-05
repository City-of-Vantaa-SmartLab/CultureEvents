#!/usr/bin/env bash

cd backend/
docker build . -t vantaa-culture-reservations-backend:latest
cd ..
docker build . -t vantaa-culture-reservations:latest