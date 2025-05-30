     FROM node:22.14.0 AS builder

    WORKDIR /app
    
    # Copy cấu hình trước để tối ưu cache
    COPY package.json package-lock.json ./
    
    # Cài dependencies
    RUN npm install
    
    # Copy source code
    COPY . .
    
    # Cài esbuild nếu cần (fix version mismatch)
#     RUN npm install esbuild --force
    
    # Build dự án (ra thư mục dist/)
    RUN npm run build
    
    # ----- STAGE 2: Production -----
    FROM node:alpine
    
    WORKDIR /app
    
    # Cài đặt serve để chạy static files
    RUN npm install -g serve
    
    # Copy thư mục dist từ stage 1
    COPY --from=builder /app/dist ./dist
    
    EXPOSE 5173
    
    # Chạy production server
    CMD ["serve", "-s", "dist", "-l", "5173"]
    