# First stage: Build
FROM oven/bun:latest as builder
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y npm && \
    npm install -g pnpm && \
    pnpm install && \
    pnpm run build && \
    bun build server/index.ts --target bun --outdir dist --packages bundle

# Second stage: Run
FROM oven/bun:latest
WORKDIR /app
COPY --from=builder /app/dist /app/dist
WORKDIR /app/dist
CMD ["bun", "run", "index.js"]
