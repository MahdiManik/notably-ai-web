import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { summarizeArticle } from '@/lib/openai'
import { z } from 'zod'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  tags: z.array(z.string()).default([]),
})

const updateArticleSchema = articleSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []

    let whereClause: any = {
      userId: user.id,
    }

    // Build filters array
    const filters: any[] = []

    // Add search filters
    if (search) {
      filters.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { body: { contains: search, mode: 'insensitive' } },
        ]
      })
    }

    // Add tag filters
    if (tags.length > 0) {
      filters.push({
        tags: {
          hasSome: tags,
        }
      })
    }

    // Combine filters with AND logic
    if (filters.length > 0) {
      whereClause.AND = filters
    }

    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        body: true,
        tags: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Articles GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    if (action === 'create') {
      return handleCreateArticle(body, user.id)
    } else if (action === 'update') {
      return handleUpdateArticle(body, user.id)
    } else if (action === 'delete') {
      return handleDeleteArticle(body, user.id)
    } else if (action === 'summarize') {
      return handleSummarizeArticle(body, user.id)
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Articles POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleCreateArticle(body: any, userId: string) {
  try {
    const { title, body: articleBody, tags } = articleSchema.parse(body)

    const article = await prisma.article.create({
      data: {
        title,
        body: articleBody,
        tags,
        userId,
      },
      select: {
        id: true,
        title: true,
        body: true,
        tags: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      article,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    throw error
  }
}

async function handleUpdateArticle(body: any, userId: string) {
  try {
    const { id, ...updateData } = body
    const validatedData = updateArticleSchema.parse(updateData)

    // Check if article exists and belongs to user
    const existingArticle = await prisma.article.findFirst({
      where: { id, userId }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const article = await prisma.article.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        title: true,
        body: true,
        tags: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      article,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    throw error
  }
}

async function handleDeleteArticle(body: any, userId: string) {
  try {
    const { id } = body

    // Check if article exists and belongs to user
    const existingArticle = await prisma.article.findFirst({
      where: { id, userId }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    await prisma.article.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    throw error
  }
}

async function handleSummarizeArticle(body: any, userId: string) {
  try {
    const { id } = body

    // Check if article exists and belongs to user
    const article = await prisma.article.findFirst({
      where: { id, userId }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Generate summary
    const summary = await summarizeArticle({
      title: article.title,
      body: article.body,
    })

    // Update article with summary
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { summary },
      select: {
        id: true,
        title: true,
        body: true,
        tags: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      article: updatedArticle,
    })
  } catch (error) {
    throw error
  }
}
