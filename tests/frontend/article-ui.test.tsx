// import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
// import { ArticleCard } from '@/features/articles/components/ArticleCard'
// import { ArticleForm } from '@/features/articles/components/ArticleForm'

// // Mock next/link
// jest.mock('next/link', () => {
//   return ({ children, href }: { children: React.ReactNode; href: string }) => {
//     return <a href={href}>{children}</a>
//   }
// })

// const mockArticle = {
//   id: 'article-1',
//   title: 'Test Article',
//   body: 'This is a test article body that should be truncated in the card view',
//   tags: ['test', 'article', 'frontend'],
//   summary: 'This is a test summary',
//   createdAt: '2024-01-01T00:00:00.000Z',
//   updatedAt: '2024-01-01T00:00:00.000Z',
// }

// describe('ArticleCard', () => {
//   const mockProps = {
//     article: mockArticle,
//     onEdit: jest.fn(),
//     onDelete: jest.fn(),
//     onSummarize: jest.fn(),
//   }

//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   it('renders article information correctly', () => {
//     render(<ArticleCard {...mockProps} />)

//     expect(screen.getByText('Test Article')).toBeInTheDocument()
//     expect(screen.getByText(/This is a test article body/)).toBeInTheDocument()
//     // Tags are now prefixed with # in the UI
//     expect(screen.getByText(/#test/)).toBeInTheDocument()
//     expect(screen.getByText(/#article/)).toBeInTheDocument()
//     expect(screen.getByText(/#frontend/)).toBeInTheDocument()
//     expect(screen.getByText('This is a test summary')).toBeInTheDocument()
//   })

//   it('calls onEdit when edit button is clicked', () => {
//     render(<ArticleCard {...mockProps} />)

//     const editButton = screen.getByTitle('Edit article')
//     fireEvent.click(editButton)

//     expect(mockProps.onEdit).toHaveBeenCalledTimes(1)
//   })

//   it('calls onDelete when delete button is clicked', async () => {
//     render(<ArticleCard {...mockProps} />)

//     const deleteButton = screen.getByTitle('Delete article')

//     await act(async () => {
//       fireEvent.click(deleteButton)
//       await Promise.resolve() // Allow any pending promises to resolve
//     })

//     expect(mockProps.onDelete).toHaveBeenCalledTimes(1)
//   })

//   it('shows summarize button when no summary exists', () => {
//     const articleWithoutSummary = { ...mockArticle, summary: null }
//     render(<ArticleCard {...mockProps} article={articleWithoutSummary} />)

//     const summarizeButton = screen.getByText('Summarize')
//     expect(summarizeButton).toBeInTheDocument()
//   })

//   it('calls onSummarize when summarize button is clicked', async () => {
//     const articleWithoutSummary = { ...mockArticle, summary: null }
//     const mockOnSummarize = jest.fn().mockResolvedValue(undefined)

//     render(
//       <ArticleCard
//         {...mockProps}
//         article={articleWithoutSummary}
//         onSummarize={mockOnSummarize}
//       />
//     )

//     const summarizeButton = screen.getByText('Summarize')

//     await act(async () => {
//       fireEvent.click(summarizeButton)
//       await Promise.resolve() // Allow any pending promises to resolve
//     })

//     expect(mockOnSummarize).toHaveBeenCalled()
//   })

//   it('does not show summarize button when summary exists', () => {
//     render(<ArticleCard {...mockProps} />)

//     expect(screen.queryByText('Summarize')).not.toBeInTheDocument()
//   })

//   it('truncates long tag lists', () => {
//     const articleWithManyTags = {
//       ...mockArticle,
//       tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
//     }
//     render(<ArticleCard {...mockProps} article={articleWithManyTags} />)

//     // Check for the first 3 tags and the "+N more" indicator
//     expect(screen.getByText(/#tag1/)).toBeInTheDocument()
//     expect(screen.getByText(/#tag2/)).toBeInTheDocument()
//     expect(screen.getByText(/#tag3/)).toBeInTheDocument()
//     // Match the exact text content including the "+1 more" text
//     expect(screen.getByText(/\+1\s+more/)).toBeInTheDocument()
//   })
// })

// describe('ArticleForm', () => {
//   const mockProps = {
//     onSubmit: jest.fn(),
//     onCancel: jest.fn(),
//   }

//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   it('renders form fields correctly', () => {
//     render(<ArticleForm {...mockProps} />)

//     expect(screen.getByLabelText('Title')).toBeInTheDocument()
//     expect(screen.getByLabelText('Content')).toBeInTheDocument()
//     expect(screen.getByPlaceholderText('Add tags (press Enter or comma to add)...')).toBeInTheDocument()
//     expect(screen.getByText('Create Article')).toBeInTheDocument()
//     expect(screen.getByText('Cancel')).toBeInTheDocument()
//   })

//   it('populates form with initial data when provided', () => {
//     render(<ArticleForm {...mockProps} initialData={mockArticle} />)

//     expect(screen.getByDisplayValue('Test Article')).toBeInTheDocument()
//     expect(screen.getByDisplayValue('This is a test article body that should be truncated in the card view')).toBeInTheDocument()
//     expect(screen.getByText(/#test/)).toBeInTheDocument()
//     expect(screen.getByText(/#article/)).toBeInTheDocument()
//     expect(screen.getByText('Update Article')).toBeInTheDocument()
//   })

//   it('calls onSubmit with form data when submitted', async () => {
//     render(<ArticleForm {...mockProps} />)

//     const titleInput = screen.getByLabelText('Title')
//     const contentInput = screen.getByLabelText('Content')
//     const submitButton = screen.getByText('Create Article')

//     fireEvent.change(titleInput, { target: { value: 'New Article' } })
//     fireEvent.change(contentInput, { target: { value: 'New article content' } })
//     fireEvent.click(submitButton)

//     await waitFor(() => {
//       expect(mockProps.onSubmit).toHaveBeenCalledWith({
//         title: 'New Article',
//         body: 'New article content',
//         tags: [],
//       })
//     })
//   })

//   it('adds tags when Enter is pressed', () => {
//     render(<ArticleForm {...mockProps} />)

//     const tagInput = screen.getByPlaceholderText('Add tags (press Enter or comma to add)...')

//     fireEvent.change(tagInput, { target: { value: 'newtag' } })
//     fireEvent.keyDown(tagInput, { key: 'Enter' })

//     expect(screen.getByText(/#newtag/)).toBeInTheDocument()
//     expect(tagInput).toHaveValue('')
//   })

//   it('adds tags when comma is pressed', () => {
//     render(<ArticleForm {...mockProps} />)

//     const tagInput = screen.getByPlaceholderText('Add tags (press Enter or comma to add)...')

//     fireEvent.change(tagInput, { target: { value: 'anothertag' } })
//     fireEvent.keyDown(tagInput, { key: ',' })

//     expect(screen.getByText(/#anothertag/)).toBeInTheDocument()
//     expect(tagInput).toHaveValue('')
//   })

//   it('removes tags when X button is clicked', () => {
//     render(<ArticleForm {...mockProps} initialData={mockArticle} />)

//     const testTag = screen.getByText(/#test/)
//     expect(testTag).toBeInTheDocument()

//     // Find the X button within the tag
//     const removeButton = testTag.parentElement?.querySelector('button')
//     if (removeButton) {
//       fireEvent.click(removeButton)
//     }

//     expect(screen.queryByText(/#test/)).not.toBeInTheDocument()
//   })

//   it('prevents duplicate tags', () => {
//     render(<ArticleForm {...mockProps} initialData={mockArticle} />)

//     const tagInput = screen.getByPlaceholderText('Add tags (press Enter or comma to add)...')

//     // Try to add existing tag
//     fireEvent.change(tagInput, { target: { value: 'test' } })
//     fireEvent.keyDown(tagInput, { key: 'Enter' })

//     // Find all instances of the test tag
//     const testTags = screen.getAllByText(/#test/)
//     // Should only be one instance of the tag (the original one)
//     expect(testTags).toHaveLength(1)
//   })

//   it('shows validation errors for empty fields', async () => {
//     render(<ArticleForm {...mockProps} />)

//     const submitButton = screen.getByRole('button', { name: /create article/i })

//     fireEvent.click(submitButton)

//     // Wait for validation errors to appear
//     await waitFor(() => {
//       // Check for the error messages in the document
//       expect(screen.getByText('Title is required')).toBeInTheDocument()
//       expect(screen.getByText('Body is required')).toBeInTheDocument()
//     })

//     expect(mockProps.onSubmit).not.toHaveBeenCalled()
//   })

//   it('calls onCancel when cancel button is clicked', () => {
//     render(<ArticleForm {...mockProps} />)

//     const cancelButton = screen.getByText('Cancel')
//     fireEvent.click(cancelButton)

//     expect(mockProps.onCancel).toHaveBeenCalledTimes(1)
//   })
// })
