'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Edit, Trash2, Sparkles, Calendar, Eye } from 'lucide-react'

interface Article {
  id: string
  title: string
  body: string
  tags: string[]
  summary: string | null
  createdAt: string
  updatedAt: string
}

interface ArticleCardProps {
  article: Article
  onEdit: () => void
  onDelete: () => void
  onSummarize: () => void
}

export function ArticleCard({ article, onEdit, onDelete, onSummarize }: ArticleCardProps) {
  const [summarizing, setSummarizing] = useState(false)

  const handleSummarize = async () => {
    setSummarizing(true)
    try {
      await onSummarize()
    } finally {
      setSummarizing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {article.title}
          </h3>
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="p-1 h-8 w-8"
              title="Edit article"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
              title="Delete article"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncateText(article.body, 150)}
        </p>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200 hover:bg-blue-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 4 && (
              <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                +{article.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {article.summary && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex items-center mb-1">
              <Sparkles className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-blue-800">AI Summary</span>
            </div>
            <p className="text-sm text-blue-700 line-clamp-2">
              {article.summary}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(article.updatedAt)}
          </div>
          
          <div className="flex space-x-2">
            <Link href={`/articles/${article.id}`}>
              <Button variant="ghost" size="sm" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </Link>
            
            {!article.summary && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSummarize}
                loading={summarizing}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Summarize
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
