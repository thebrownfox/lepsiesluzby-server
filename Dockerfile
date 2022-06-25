FROM node:lts-alpine
ENV NODE_ENV=production
ENV JIRA_USER=
ENV JIRA_TOKEN=
WORKDIR /usr/src/app
COPY . ./
RUN chown -R node /usr/src/app
RUN yarn install
EXPOSE 3100
USER node
CMD ["yarn", "start"]
