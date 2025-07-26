# Notably AI 🧠✨

A full-stack AI-powered knowledge base application built with Next.js 14, TypeScript, and OpenAI integration. Organize, search, and summarize your articles with the power of artificial intelligence.

![Notably AI](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-green?style=for-the-badge&logo=openai)

## 🚀 Features

### 🔐 Authentication

- **Secure Login/Signup**: Email and password authentication with JWT tokens
- **Session Management**: HttpOnly cookies for secure token storage
- **Protected Routes**: Automatic redirection for authenticated/unauthenticated users

### 📝 Article Management

- **Full CRUD Operations**: Create, read, update, and delete articles
- **Rich Content**: Support for long-form content with markdown-style formatting
- **Tag System**: Organize articles with custom tags
- **User Ownership**: Users can only access their own articles

### 🔍 Search & Discovery

- **Keyword Search**: Search across article titles and content
- **Tag Filtering**: Filter articles by one or multiple tags
- **Real-time Results**: Instant search results as you type
- **Combined Filters**: Use search and tags together for precise results

### 🤖 AI-Powered Summarization

- **OpenAI Integration**: Generate intelligent summaries using GPT-3.5-turbo
- **Mock Fallback**: Graceful fallback when OpenAI API is unavailable
- **One-Click Summaries**: Generate summaries with a single button click
- **Persistent Storage**: Summaries are saved and displayed with articles

### 🎨 Modern UI/UX

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean Interface**: Minimalist design focused on content
- **Interactive Elements**: Smooth animations and transitions
- **Toast Notifications**: Real-time feedback for user actions
- **Modal Dialogs**: Elegant forms and confirmations

## 🛠️ Tech Stack

### Frontend

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components
- **React Hot Toast** - Beautiful notifications

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing

### AI & External Services

- **OpenAI API** - GPT-3.5-turbo for summarization
- **Zod** - Runtime type validation

### Development & Testing

- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

### Deployment & DevOps

- **Vercel** - Hosting and deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/notably-ai.git
cd notably-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/notably
JWT_SECRET=r9trtQDXr1MeT4JZvPbQLw==
OPENAI_API_KEY=your-openai-key  # Optional
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Optional: Open Prisma Studio
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 📁 Project Structure

```
notably-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/              # Protected dashboard
│   │   ├── articles/
│   │   │   ├── page.tsx          # Articles list
│   │   │   └── [id]/page.tsx     # Article detail
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── auth/route.ts         # Authentication endpoints
│   │   └── articles/route.ts     # Article CRUD endpoints
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable UI components
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Textarea.tsx
├── features/                     # Feature-based modules
│   ├── articles/
│   │   └── components/
│   │       ├── ArticleCard.tsx
│   │       └── ArticleForm.tsx
│   └── dashboard/
│       └── components/
│           └── DashboardNav.tsx
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication utilities
│   ├── openai.ts                 # OpenAI integration
│   └── prisma.ts                 # Database client
├── prisma/
│   └── schema.prisma             # Database schema
├── tests/                        # Test files
│   ├── backend/
│   │   └── article.test.ts
│   └── frontend/
│       └── article-ui.test.tsx
└── ...config files
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Docker

```bash
# Build the image
docker build -t notably-ai .

# Run the container
docker run -p 3000:3000 notably-ai
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `OPENAI_API_KEY`: OpenAI API key (optional, falls back to mock)

### Database Configuration

The application uses PostgreSQL with Prisma ORM. The schema includes:

- **Users**: Authentication and user management
- **Articles**: Content storage with tags and summaries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes linting and formatting

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth` - Login, signup, logout

### Article Endpoints

- `GET /api/articles` - List user articles (with search/filter)
- `POST /api/articles` - Create, update, delete, summarize articles

## 🔒 Security

- **Password Hashing**: bcryptjs with 12 rounds
- **JWT Tokens**: Stored in HttpOnly cookies
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **CORS**: Configured for production domains

## 📊 Performance

- **Server-Side Rendering**: Fast initial page loads
- **Code Splitting**: Automatic route-based splitting
- **Database Optimization**: Efficient queries with Prisma
- **Caching**: Built-in Next.js caching strategies

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**

```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string in .env
echo $DATABASE_URL
```

**OpenAI API Issues**

- Verify API key is correct
- Check API usage limits
- Application will fallback to mock summaries

**Build Errors**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Excellent hosting platform
- **OpenAI** - Powerful AI capabilities
- **Prisma** - Developer-friendly ORM
- **TailwindCSS** - Utility-first CSS framework

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Review the test files for usage examples

---

**Built with ❤️ using Next.js, TypeScript, and OpenAI**
