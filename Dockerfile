FROM vantaa-culture-reservations-backend:latest
ADD ./frontend /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build
RUN cp -r ./build ../backend/public
WORKDIR /backend
CMD ["npm", "start"]