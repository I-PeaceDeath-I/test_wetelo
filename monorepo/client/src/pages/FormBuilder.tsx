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
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm border-t-[10px] border-purple-700 p-6 mb-4">
        <input
          className="w-full text-3xl font-normal border-b border-transparent focus:border-gray-200 focus:outline-none mb-4 py-2"
          placeholder="Untitled form"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full text-sm border-b border-transparent focus:border-gray-200 focus:outline-none py-1 resize-none"
          placeholder="Form description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-4 mb-8">
        {questions.map((q, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative group">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                className="flex-1 bg-gray-50 border-b-2 border-transparent focus:border-purple-700 focus:outline-none p-3 transition-colors"
                placeholder="Question"
                value={q.text}
                onChange={(e) => updateQuestion(i, { text: e.target.value })}
              />
              <select
                className="bg-white border rounded px-3 py-2 text-sm outline-none"
                value={q.type}
                onChange={(e) => updateQuestion(i, { type: e.target.value as QuestionType })}
              >
                <option value={QuestionType.Text}>Short answer</option>
                <option value={QuestionType.MultipleChoice}>Multiple choice</option>
                <option value={QuestionType.Checkbox}>Checkboxes</option>
                <option value={QuestionType.Date}>Date</option>
              </select>
            </div>

            {/* Options Logic */}
            {(q.type === QuestionType.MultipleChoice || q.type === QuestionType.Checkbox) && (
              <div className="space-y-3 ml-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-3">
                    <div className={`w-4 h-4 border-2 ${q.type === QuestionType.Checkbox ? 'rounded-sm' : 'rounded-full'} border-gray-300`} />
                    <input
                      className="flex-1 border-b border-gray-200 focus:border-purple-700 focus:outline-none text-sm py-1"
                      placeholder={`Option ${oi + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(i, oi, e.target.value)}
                    />
                    <button onClick={() => removeOption(i, oi)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                ))}
                <button onClick={() => addOption(i)} className="text-purple-700 text-sm font-medium hover:bg-purple-50 px-2 py-1 rounded">
                  Add option
                </button>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-4">
              <button onClick={() => removeQuestion(i)} className="text-gray-500 hover:text-red-600">
                <span className="text-sm">Delete Question</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-6 flex justify-center gap-4">
        <button onClick={addQuestion} className="bg-white shadow-md border px-6 py-2 rounded-full text-purple-700 font-medium hover:bg-gray-50">
          + Add Question
        </button>
        <button onClick={handleSubmit} className="bg-purple-700 shadow-md text-white px-8 py-2 rounded-full font-medium hover:bg-purple-800 transition-colors">
          Save Form
        </button>
      </div>
    </div>
  )
}