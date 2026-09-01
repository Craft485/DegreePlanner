FROM node:24-bookworm AS base

WORKDIR /workspace

RUN corepack enable && \
  corepack use pnpm@latest-11

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile
