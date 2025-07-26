'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { ArticleForm } from '@/features/articles/components/ArticleForm'
import { ArticleCard } from '@/features/articles/components/ArticleCard'
import { Plus, Search } from 'lucide-react'
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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Get all unique tags from articles
  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags))
  ).sort()

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))

      const response = await fetch(`/api/articles?${params}`)
      const data = await response.json()

      if (response.ok) {
        setArticles(data.articles)
      } else {
        toast.error(data.error || 'Failed to fetch articles')
      }
    } catch (error) {
      toast.error('An error occurred while fetching articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [search, selectedTags])

  const handleCreateArticle = async (articleData: any) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          ...articleData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Article created successfully!')
        setIsCreateModalOpen(false)
        fetchArticles()
      } else {
        toast.error(data.error || 'Failed to create article')
      }
    } catch (error) {
      toast.error('An error occurred while creating the article')
    }
  }

  const handleUpdateArticle = async (articleData: any) => {
    if (!editingArticle) return

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          id: editingArticle.id,
          ...articleData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Article updated successfully!')
        setEditingArticle(null)
        fetchArticles()
      } else {
        toast.error(data.error || 'Failed to update article')
      }
    } catch (error) {
      toast.error('An error occurred while updating the article')
    }
  }

  const handleDeleteArticle = async () => {
    if (!deletingArticle) return

    setDeleteLoading(true)
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id: deletingArticle.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Article deleted successfully!')
        setDeletingArticle(null)
        fetchArticles()
      } else {
        toast.error(data.error || 'Failed to delete article')
      }
    } catch (error) {
      toast.error('An error occurred while deleting the article')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSummarizeArticle = async (id: string) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'summarize',
          id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Article summarized successfully!')
        fetchArticles()
      } else {
        toast.error(data.error || 'Failed to summarize article')
      }
    } catch (error) {
      toast.error('An error occurred while summarizing the article')
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Articles</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {allTags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Filter by tags:</p>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all ({selectedTags.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found.</p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4"
          >
            Create your first article
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onEdit={() => setEditingArticle(article)}
              onDelete={() => setDeletingArticle(article)}
              onSummarize={() => handleSummarizeArticle(article.id)}
            />
          ))}
        </div>
      )}

      {/* Create Article Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Article"
        maxWidth="lg"
      >
        <ArticleForm
          onSubmit={handleCreateArticle}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Article Modal */}
      <Modal
        isOpen={!!editingArticle}
        onClose={() => setEditingArticle(null)}
        title="Edit Article"
        maxWidth="lg"
      >
        {editingArticle && (
          <ArticleForm
            initialData={editingArticle}
            onSubmit={handleUpdateArticle}
            onCancel={() => setEditingArticle(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingArticle}
        onClose={() => setDeletingArticle(null)}
        onConfirm={handleDeleteArticle}
        title="Delete Article"
        message={`Are you sure you want to delete "${deletingArticle?.title}"? This action cannot be undone.`}
        confirmText="Delete Article"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
