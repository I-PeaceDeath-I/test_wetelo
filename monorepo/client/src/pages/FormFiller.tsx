import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetFormQuery, useSubmitResponseMutation } from '../store/enhancedApi'
import { QuestionType, type Question } from '../generated/graphql'

export default function FormFiller() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetFormQuery({ id: id! })
  const [submitResponse] = useSubmitResponseMutation()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const toggleCheckbox = (questionId: string, option: string) => {
    const current = answers[questionId] ? answers[questionId].split(',') : []
    const updated = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option]
    setAnswer(questionId, updated.join(','))
  }

  const handleSubmit = async () => {
    try {
      await submitResponse({
        formId: id!,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value,
        })),
      }).unwrap()
      setSubmitted(true)
    } catch {
      setError('Submission failed. Please try again.')
    }
  }

  if (isLoading) return <p className="p-6">Loading...</p>
  if (!data?.form) return <p className="p-6">Form not found.</p>
  if (submitted) return (
     <div className="max-w-3xl mx-auto p-6">
          <Link to="/" className="text-blue-500 hover:underline text-sm">← Back</Link>
            <div className="max-w-2xl mx-auto p-6 text-center">
            <p className="text-green-600 text-xl font-semibold">✓ Form submitted successfully!</p>
            </div>
    </div>
  )

  return (
    
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">{data.form.title}</h1>
      {data.form.description && (
        <p className="text-gray-500 mb-6">{data.form.description}</p>
      )}
        
      <div className="space-y-6">
        {data.form.questions.map((q: Question) => (
          <div key={q.id}>
            <p className="font-medium mb-2">{q.text}</p>

            {q.type === QuestionType.Text && (
              <input
                className="w-full border rounded px-3 py-2"
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
              />
            )}

            {q.type === QuestionType.Date && (
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
              />
            )}

            {q.type === QuestionType.MultipleChoice && (
              <div className="space-y-1">
                {q.options?.map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt ?? ''}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswer(q.id, opt ?? '')}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === QuestionType.Checkbox && (
              <div className="space-y-1">
                {q.options?.map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={answers[q.id]?.split(',').includes(opt ?? '') ?? false}
                      onChange={() => toggleCheckbox(q.id, opt ?? '')}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <button
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  )
}