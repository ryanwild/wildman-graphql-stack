FROM node:24.18.0-alpine AS base
WORKDIR /workspace
ENV PORT=80
ENV HOST="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP_NAME=userui
ENV USER=app
ENV GROUPNAME=$USER
ENV UID=1001
ENV GID=2002
ENV NPM_CONFIG_CACHE=/workspace/.npm
RUN addgroup --system --gid "$GID" "$GROUPNAME" && \
  adduser --system --disabled-password --gecos "" --home "$(pwd)" --ingroup "$GROUPNAME" --no-create-home --uid "$UID" "$USER"
RUN npm install -g npm@12.0.1
RUN mkdir -p /workspace/.npm && chown -R ${USER}:${GROUPNAME} "/workspace/.npm"
RUN mkdir -p /cert && chown -R ${USER}:${GROUPNAME} /cert
VOLUME /cert
HEALTHCHECK --interval=30s --timeout=30s --start-period=90s --retries=3 \
  CMD wget --no-verbose --tries=1 -qO- http://0.0.0.0/health || exit 1

##### CI
FROM base AS ci
WORKDIR /workspace
COPY --chown=${USER}:${GROUPNAME} "./$APP_NAME" "./$APP_NAME"
COPY --chown=${USER}:${GROUPNAME} ./shared/dist/ ./shared/dist/
COPY --chown=${USER}:${GROUPNAME} ./shared/package.json ./shared/package.json
COPY --chown=${USER}:${GROUPNAME} package.json package-lock.json .npmrc .env ./
# install production node modules
RUN NODE_ENV=production npm ci --workspace="$APP_NAME" --workspace=shared --omit=dev &&\
  mv ./node_modules /prod_node_modules

RUN if [ -d "./$APP_NAME/node_modules" ]; then \
  mv "./$APP_NAME/node_modules" /prod_app_node_modules; \
  else \
  mkdir -p /prod_app_node_modules; \
  fi
# install ALL node modules, including 'devDependencies'
RUN npm ci --workspace="$APP_NAME" --workspace=shared &&\
  npm run --workspace="$APP_NAME" build

##### Production
FROM base AS production
WORKDIR "/workspace/$APP_NAME"
COPY --chown=${USER}:${GROUPNAME} --from=ci /prod_node_modules /workspace/node_modules/
COPY --chown=${USER}:${GROUPNAME} --from=ci /prod_app_node_modules "/workspace/$APP_NAME/node_modules"
COPY --chown=${USER}:${GROUPNAME} --from=ci "/workspace/$APP_NAME/" "/workspace/$APP_NAME/"
COPY --chown=${USER}:${GROUPNAME} --from=ci /workspace/shared/ /workspace/shared/
COPY --chown=${USER}:${GROUPNAME} package.json package-lock.json .npmrc /workspace/
USER "$USER:$GROUPNAME"
CMD ["npm","run", "start"]

##### Development
FROM ci AS development
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
WORKDIR "/workspace/$APP_NAME"
CMD ["npm","run", "dev"]

