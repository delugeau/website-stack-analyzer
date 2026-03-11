FROM mcr.microsoft.com/playwright:v1.58.2-noble

WORKDIR /app

# Playwright browsers are already installed in the base image
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
