'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { ArticleForm } from '@/features/articles/components/ArticleForm'
import { ArrowLeft, Edit, Trash2, Sparkles, Calendar, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

interface Article {
  id: string
  title: string
  body: string
  tags: string[]
  summary: string | null
  createdAt: string
  updatedAt: string
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [summarizing, setSummarizing] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const router = useRouter()

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles?id=${params.id}`)
      const data = await response.json()

      if (response.ok && data.articles.length > 0) {
        setArticle(data.articles[0])
      } else {
        toast.error('Article not found')
        router.push('/articles')
      }
    } catch (error) {
      toast.error('An error occurred while fetching the article')
      router.push('/articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticle()
  }, [params.id])

  const handleUpdateArticle = async (articleData: any) => {
    if (!article) return

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          id: article.id,
          ...articleData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Article updated successfully!')
        setIsEditModalOpen(false)
        setArticle(data.article)
      } else {
        toast.error(data.error || 'Failed to update article')
      }
    } catch (error) {
      toast.error('An error occurred while updating the article')
    }
  }

  const handleDeleteArticle = async () => {
    if (!article) return

    setDeleteLoading(true)
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id: article.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Article deleted successfully!')
        router.push('/articles')
      } else {
        toast.error(data.error || 'Failed to delete article')
      }
    } catch (error) {
      toast.error('An error occurred while deleting the article')
    } finally {
      setDeleteLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  const handleSummarizeArticle = async () => {
    if (!article) return

    setSummarizing(true)
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'summarize',
          id: article.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Article summarized successfully!')
        setArticle(data.article)
      } else {
        toast.error(data.error || 'Failed to summarize article')
      }
    } catch (error) {
      toast.error('An error occurred while summarizing the article')
    } finally {
      setSummarizing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Article not found.</p>
        <Button onClick={() => router.push('/articles')} className="mt-4">
          Back to Articles
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/articles')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created: {formatDate(article.createdAt)}
              </div>
              {article.updatedAt !== article.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Updated: {formatDate(article.updatedAt)}
                </div>
              )}
            </div>

            {article.tags.length > 0 && (
              <div className="flex items-start space-x-3 mb-6">
                <Tag className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-block px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200 hover:bg-blue-200 transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2 ml-4">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {article.summary ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-3">
            <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-blue-800">AI Summary</h2>
          </div>
          <p className="text-blue-700 leading-relaxed">{article.summary}</p>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              No summary available for this article yet.
            </p>
            <Button
              onClick={handleSummarizeArticle}
              loading={summarizing}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Summary
            </Button>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {article.body}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Article"
        maxWidth="lg"
      >
        <ArticleForm
          initialData={article}
          onSubmit={handleUpdateArticle}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteArticle}
        title="Delete Article"
        message={`Are you sure you want to delete "${article?.title}"? This action cannot be undone and you will be redirected to the articles list.`}
        confirmText="Delete Article"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
