FROM node:24-slim

ENV EXPO_NO_TELEMETRY=1 \
    CI=1 \
    PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# 8081: Metro / Expo web
EXPOSE 8081

CMD ["pnpm", "exec", "expo", "start", "--web", "--port", "8081"]
