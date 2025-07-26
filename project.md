# Notably AI - Project Overview

## Architecture

**Auth Flow**: JWT authentication via HttpOnly cookies, no roles system

**Data Model**: Articles are owned by logged-in users only - users can only CRUD their own articles

**AI Integration**: OpenAI integration with fallback to mock summaries when API key is not available

**Search & Filter**: Tag-based and keyword-based search functionality

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, TailwindCSS
- **Backend**: Next.js API routes (not Express)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT in HttpOnly cookies
- **AI**: OpenAI API integration with mock fallback
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel (free tier)
- **DevOps**: Docker + GitHub Actions

## Key Features

1. **User Authentication**
   - Email/password signup and login
   - JWT stored in HttpOnly cookies
   - Protected routes and API endpoints

2. **Article Management**
   - Full CRUD operations for articles
   - Rich text content with tags
   - User-specific article ownership

3. **Search & Discovery**
   - Keyword search across title and body
   - Tag-based filtering
   - Combined search functionality

4. **AI Summarization**
   - OpenAI-powered article summaries
   - Mock summaries when API key unavailable
   - One-click summarization

5. **Modern UI/UX**
   - Responsive design with TailwindCSS
   - Reusable component library
   - Toast notifications for feedback
   - Modal dialogs for forms

## Security

- Password hashing with bcryptjs
- JWT token validation
- User-specific data access
- Input validation with Zod
- SQL injection protection via Prisma

## Performance

- Server-side rendering with Next.js
- Optimized database queries
- Efficient client-side state management
- Image and asset optimization
