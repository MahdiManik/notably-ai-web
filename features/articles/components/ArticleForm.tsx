'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { X } from 'lucide-react'

interface Article {
  id: string
  title: string
  body: string
  tags: string[]
  summary: string | null
  createdAt: string
  updatedAt: string
}

interface ArticleFormProps {
  initialData?: Article
  onSubmit: (data: { title: string; body: string; tags: string[] }) => void
  onCancel: () => void
}

export function ArticleForm({ initialData, onSubmit, onCancel }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [body, setBody] = useState(initialData?.body || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    title?: string;
    body?: string;
    form?: string;
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!body.trim()) newErrors.body = 'Body is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim(),
        tags,
      })
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        ...errors,
        form: error instanceof Error ? error.message : 'An unexpected error occurred while saving the article'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="Enter article title..."
        required
      />
      {errors.title && (
        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
      )}


      <Textarea
        label="Content"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        error={errors.body}
        placeholder="Write your article content here..."
        rows={10}
        required
      />
      {errors.body && (
        <p className="text-red-500 text-sm mt-1">{errors.body}</p>
      )}


      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <Input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags (press Enter or comma to add)..."
          helperText="Press Enter or comma to add a tag"
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-200 transition-colors"
                  title={`Remove ${tag} tag`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 mt-6">
        {errors.form && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {errors.form}
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Article'}
          </Button>
        </div>
      </div>
    </form>
  )
}
