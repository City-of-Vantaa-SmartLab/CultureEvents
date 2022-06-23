FROM node:12.22.12

ADD ./backend /backend
ADD ./frontend /frontend

WORKDIR /frontend
RUN npm install
RUN npm run build
RUN cp -r ./build ../backend/public

WORKDIR /backend
RUN npm install

#ENV SEED_DB=1
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
