FROM node:22-alpine

WORKDIR /app

# Cài đặt thư viện cần thiết cho Prisma Query Engine trên Alpine Linux
RUN apk add --no-cache libc6-compat openssl

# Kích hoạt pnpm phiên bản tương thích với monorepo
RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

# Ngăn pnpm yêu cầu TTY confirmation khi chạy trong Docker/CI
ENV CI=true
ENV PNPM_CONFIRM_MODULES_PURGE=false

# Copy các file cấu hình dependency & workspace để tối ưu Docker layer cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY packages ./packages

# Cài đặt toàn bộ dependencies cho backend
RUN pnpm install --frozen-lockfile

# Copy mã nguồn backend & tsconfig
COPY tsconfig.json ./
COPY apps/backend ./apps/backend

# Sinh mã Prisma Client từ Multi-file schema
RUN DATABASE_URL="postgresql://unused:unused@localhost:5432/unused?schema=public" pnpm --filter backend prisma:generate

# Build ứng dụng NestJS
RUN pnpm --filter backend build

EXPOSE 8000

# Apply production migrations, optionally seed the demo dataset once, then start the API.
CMD ["sh", "-c", "pnpm --filter backend prisma:deploy && if [ \"$SEED_DEMO_DATA\" = \"true\" ]; then pnpm --filter backend prisma:seed; fi && exec pnpm --filter backend start:prod"]
