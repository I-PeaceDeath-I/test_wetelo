import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateFormMutation } from '../store/enhancedApi'
import { QuestionType } from '../generated/graphql'

interface QuestionDraft {
  text: string
  type: QuestionType
  options: string[]
}

export default function FormBuilder() {
  const navigate = useNavigate()
  const [createForm] = useCreateFormMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<QuestionDraft[]>([])

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: QuestionType.Text, options: [] }])
  }

  const updateQuestion = (index: number, updates: Partial<QuestionDraft>) => {
    setQuestions(questions.map((q, i) => (i === index ? { ...q, ...updates } : q)))
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const addOption = (index: number) => {
    updateQuestion(index, { options: [...questions[index].options, ''] })
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const options = [...questions[qIndex].options]
    options[oIndex] = value
    updateQuestion(qIndex, { options })
  }

  const removeOption = (qIndex: number, oIndex: number) => {
    updateQuestion(qIndex, {
      options: questions[qIndex].options.filter((_, i) => i !== oIndex),
    })
  }

  const handleSubmit = async () => {
    if (!title.trim()) return alert('Title is required')
    try {
      await createForm({
        title,
        description,
        questions: questions.map(({ text, type, options }) => ({
          text,
          type,
          options: options.length > 0 ? options : undefined,
        })),
      }).unwrap()
      navigate(`/`)
    } catch {
      alert('Failed to create form')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Form</h1>

      <input
        className="w-full border rounded px-3 py-2 mb-3"
        placeholder="Form Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border rounded px-3 py-2 mb-6"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="space-y-4 mb-6">
        {questions.map((q, i) => (
          <div key={i} className="border rounded p-4">
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 border rounded px-3 py-1"
                placeholder="Question text"
                value={q.text}
                onChange={(e) => updateQuestion(i, { text: e.target.value })}
              />
              <select
                className="border rounded px-2 py-1"
                value={q.type}
                onChange={(e) => updateQuestion(i, { type: e.target.value as QuestionType })}
              >
                <option value={QuestionType.Text}>Text</option>
                <option value={QuestionType.MultipleChoice}>Multiple Choice</option>
                <option value={QuestionType.Checkbox}>Checkbox</option>
                <option value={QuestionType.Date}>Date</option>
              </select>
              <button
                className="text-red-500 hover:text-red-700 text-sm"
                onClick={() => removeQuestion(i)}
              >
                Remove
              </button>
            </div>

            {(q.type === QuestionType.MultipleChoice || q.type === QuestionType.Checkbox) && (
              <div className="ml-4 space-y-1">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex gap-2">
                    <input
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      placeholder={`Option ${oi + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(i, oi, e.target.value)}
                    />
                    <button
                      className="text-red-400 text-sm"
                      onClick={() => removeOption(i, oi)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="text-blue-500 text-sm mt-1 hover:underline"
                  onClick={() => addOption(i)}
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          className="border rounded px-4 py-2 hover:bg-gray-50"
          onClick={addQuestion}
        >
          + Add Question
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Save Form
        </button>
      </div>
    </div>
  )
}