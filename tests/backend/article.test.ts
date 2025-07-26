// // ---- Mock modules before any imports ----
// // Define mocks directly inside jest.mock() to avoid hoisting issues

// jest.mock('@/lib/prisma', () => ({
//   prisma: {
//     article: {
//       findMany: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//       findFirst: jest.fn(),
//     },
//     $disconnect: jest.fn(),
//   },
// }))

// jest.mock('@/lib/auth', () => ({
//   getCurrentUser: jest.fn(),
//   generateToken: jest.fn(),
// }))

// jest.mock('@/lib/openai', () => ({
//   summarizeArticle: jest.fn().mockResolvedValue('This is a mock summary'),
// }))

// // ✅ Now import other modules that use these mocks
// import { NextRequest } from 'next/server'
// import { GET, POST } from '@/app/api/articles/route'
// import { prisma } from '@/lib/prisma'
// import { getCurrentUser } from '@/lib/auth'
// import { summarizeArticle } from '@/lib/openai'

// // Get references to the mocked functions for use in tests
// const mockPrismaArticle = prisma.article as jest.Mocked<typeof prisma.article>
// const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<
//   typeof getCurrentUser
// >
// const mockSummarizeArticle = summarizeArticle as jest.MockedFunction<
//   typeof summarizeArticle
// >

// // ---- Mock user/article data ----
// const mockUser = {
//   id: 'user-1',
//   email: 'test@example.com',
//   name: 'Test User',
//   createdAt: new Date(),
// }

// const mockArticle: any = {
//   id: 'article-1',
//   title: 'Test Article',
//   body: 'This is a test article body',
//   tags: ['test', 'article'],
//   summary: null,
//   createdAt: '2024-01-01T00:00:00.000Z',
//   updatedAt: '2024-01-01T00:00:00.000Z',
// }

// // ---- Test suite ----
// describe('/api/articles', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   describe('GET /api/articles', () => {
//     it('should return articles for authenticated user', async () => {
//       mockGetCurrentUser.mockResolvedValue(mockUser)
//       mockPrismaArticle.findMany.mockResolvedValue([mockArticle])

//       const request = new NextRequest('http://localhost:3000/api/articles')
//       const response = await GET(request)
//       const data = await response.json()

//       expect(response.status).toBe(200)
//       expect(data.articles).toHaveLength(1)
//       expect(data.articles[0]).toEqual(mockArticle)
//     })

//     it('should return 401 for unauthenticated user', async () => {
//       mockGetCurrentUser.mockResolvedValue(null)

//       const request = new NextRequest('http://localhost:3000/api/articles')
//       const response = await GET(request)
//       const data = await response.json()

//       expect(response.status).toBe(401)
//       expect(data.error).toBe('Unauthorized')
//     })

//     it('should filter articles by search query', async () => {
//       mockGetCurrentUser.mockResolvedValue(mockUser)
//       mockPrismaArticle.findMany.mockResolvedValue([mockArticle])

//       const request = new NextRequest(
//         'http://localhost:3000/api/articles?search=test'
//       )
//       const response = await GET(request)

//       expect(response.status).toBe(200)
//       expect(mockPrismaArticle.findMany).toHaveBeenCalledWith({
//         where: {
//           userId: mockUser.id,
//           OR: [
//             { title: { contains: 'test', mode: 'insensitive' } },
//             { body: { contains: 'test', mode: 'insensitive' } },
//           ],
//         },
//         orderBy: { updatedAt: 'desc' },
//         select: expect.any(Object),
//       })
//     })
//   })

//   describe('POST /api/articles', () => {
//     it('should create a new article', async () => {
//       mockGetCurrentUser.mockResolvedValue(mockUser)
//       mockPrismaArticle.create.mockResolvedValue(mockArticle)

//       const request = new NextRequest('http://localhost:3000/articles', {
//         method: 'POST',
//         body: JSON.stringify({
//           action: 'create',
//           title: 'Test Article',
//           body: 'This is a test article body',
//           tags: ['test', 'article'],
//         }),
//       })

//       const response = await POST(request)
//       const data = await response.json()

//       expect(response.status).toBe(200)
//       expect(data.success).toBe(true)
//       expect(data.article).toEqual(mockArticle)
//     })

//     it('should return validation error for invalid data', async () => {
//       mockGetCurrentUser.mockResolvedValue(mockUser)

//       const request = new NextRequest('http://localhost:3000/articles', {
//         method: 'POST',
//         body: JSON.stringify({
//           action: 'create',
//           title: '',
//           body: 'This is a test article body',
//           tags: ['test'],
//         }),
//       })

//       const response = await POST(request)
//       const data = await response.json()

//       expect(response.status).toBe(400)
//       expect(data.error).toBe('Validation error')
//       expect(data.details).toBeDefined()
//     })

//     it('should summarize an article', async () => {
//       mockGetCurrentUser.mockResolvedValue(mockUser)
//       mockPrismaArticle.findFirst.mockResolvedValue(mockArticle)
//       mockPrismaArticle.update.mockResolvedValue({
//         ...mockArticle,
//         summary: 'This is a mock summary',
//       })

//       const request = new NextRequest('http://localhost:3000/articles', {
//         method: 'POST',
//         body: JSON.stringify({
//           action: 'summarize',
//           id: 'article-1',
//         }),
//       })

//       const response = await POST(request)
//       const data = await response.json()

//       expect(response.status).toBe(200)
//       expect(data.success).toBe(true)
//       expect(data.article.summary).toBe('This is a mock summary')
//     })
//   })
// })
