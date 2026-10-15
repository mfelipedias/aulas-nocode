# API do mural e do feedback: Node 22 puro, sem dependências.
FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./
ENV NODE_ENV=production PORT=3000 DADOS=/dados
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:3000/api/saude || exit 1
CMD ["node", "server.mjs"]
