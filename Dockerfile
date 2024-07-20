FROM node:20 AS base

#####################
## PREPARE BUILDER ##
#####################
FROM base AS builder

# RUN apk add --no-cache libc6-compat
# RUN apk update

# ENV TZ "Asia/Yekaterinburg"

# good colors for most applications
ENV TERM xterm
ENV NPM_CONFIG_LOGLEVEL warn

# RUN mkdir -p /opt/app
WORKDIR /app

RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=root --docker

#######################
## PREPARE INSTALLER ##
#######################

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
# RUN apk add --no-cache libc6-compat
# RUN apk update

WORKDIR /app

ARG API_HOST=https://api.bkkleague.com
ARG WSS_HOST=https://api.bkkleague.com
ARG CUSTOMERS_HOST
ENV API_HOST ${API_HOST}
ENV WSS_HOST ${WSS_HOST}
ENV CUSTOMERS_HOST ${CUSTOMERS_HOST}
ENV NEXT_PUBLIC_API_URL ${API_HOST}
ENV NEXT_PUBLIC_WSS_URL ${WSS_HOST}

RUN echo $NEXT_PUBLIC_API_URL
RUN echo $NEXT_PUBLIC_WSS_URL

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
COPY .postcssrc.json turbo.json .gitignore ./

RUN yarn build --filter=root

####################
## PREPARE RUNNER ##
####################
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

# COPY --from=installer --chown=nextjs:nodejs /app/apps/root/next.config.js .
# COPY --from=installer --chown=nextjs:nodejs /app/apps/root/package.json .

COPY .postcssrc.json turbo.json .gitignore ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/root/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/root/.next/static ./apps/root/.next/static
# COPY --from=installer --chown=nextjs:nodejs /app/apps/root/public ./apps/root/public

RUN ls -la /app/apps/root/.next

COPY --chown=nextjs:nodejs prepare-docker-env.sh docker-entrypoint.sh  ./
CMD ./docker-entrypoint.sh

EXPOSE 5000

