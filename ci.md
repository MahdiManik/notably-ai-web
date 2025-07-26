name: web deploy
on:
push:
branches: [main]

jobs:
deploy:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      # env get
      - name: Set environment variables
        run: |
          echo "DATABASE_URL=${{ secrets.DATABASE_URL }}" >> .env
          echo "JWT_SECRET=${{ secrets.JWT_SECRET }}" >> .env

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client & Push Schema
        run: |
          npx prisma generate
          npx prisma db push

      - name: Build application
        run: npm run build
      - name: Install vercel
        run: npm i -g vercel

      - name: Deploy to Vercel
        run: vercel --prod --yes --token=${{ secrets.VERCEL_TOKEN }} --name=booking
