FROM node:16.15.1 as frontendbuild

ADD ./frontend /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build

FROM node:12.22.12

ADD ./backend /backend
WORKDIR /backend
COPY /backend/package.json ./
RUN npm install
COPY --from=frontendbuild /frontend/build ./public

#ENV SEED_DB=1
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
