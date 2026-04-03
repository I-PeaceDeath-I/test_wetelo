import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetFormQuery, useSubmitResponseMutation } from '../store/enhancedApi'
import { QuestionType, type Question } from '../generated/graphql'

export default function FormFiller() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetFormQuery({ id: id! })
  const [submitResponse] = useSubmitResponseMutation()
  
  // Answers are stored as strings. Checkboxes are stored as "Opt1,Opt2"
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const toggleCheckbox = (questionId: string, option: string) => {
    const currentString = answers[questionId] || ''
    // Split into array, filter out any empty strings
    const currentArray = currentString ? currentString.split(',') : []
    
    const updatedArray = currentArray.includes(option)
      ? currentArray.filter((v) => v !== option)
      : [...currentArray, option]
    
    // Join back into a comma-separated string
    setAnswer(questionId, updatedArray.join(','))
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

  if (isLoading) return <div className="gform-bg p-6">Loading...</div>
  if (!data?.form) return <div className="gform-bg p-6">Form not found.</div>
  
  if (submitted) return (
    <div className="gform-bg py-12">
      <div className="max-w-2xl mx-auto gform-card gform-header-stripe text-center">
        <h1 className="text-3xl mb-4">{data.form.title}</h1>
        <p className="text-gray-600 mb-6">Your response has been recorded.</p>
        <Link to="/" className="text-purple-700 hover:underline text-sm font-medium">
          Submit another response
        </Link>
      </div>
    </div>
  )

  return (
    <div className="gform-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Form Header Card */}
        <div className="gform-card gform-header-stripe mb-4">
          <h1 className="text-3xl font-normal mb-2 text-[#202124]">{data.form.title}</h1>
          {data.form.description && (
            <p className="text-sm text-gray-600">{data.form.description}</p>
          )}
        </div>
        
        <div className="space-y-3">
          {data.form.questions.map((q: Question) => (
            <div key={q.id} className="gform-card">
              <p className="text-base font-medium mb-6 text-[#202124]">{q.text}</p>

              {/* Text Input */}
              {q.type === QuestionType.Text && (
                <input
                  type="text"
                  className="gform-input-underline md:w-1/2"
                  placeholder="Your answer"
                  value={answers[q.id] ?? ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}

              {/* Date Input - FIXED: Ensure it is typed correctly */}
              {q.type === QuestionType.Date && (
                <input
                  type="date"
                  className="border-b border-gray-300 focus:border-[#673ab7] focus:outline-none py-2 text-gray-600"
                  value={answers[q.id] ?? ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}

              {/* Multiple Choice */}
              {q.type === QuestionType.MultipleChoice && (
                <div className="space-y-4">
                  {q.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={q.id}
                        className="w-5 h-5 accent-[#673ab7]"
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswer(q.id, opt ?? '')}
                      />
                      <span className="text-sm text-[#202124]">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Checkbox - FIXED: Proper array toggle logic */}
              {q.type === QuestionType.Checkbox && (
                <div className="space-y-4">
                  {q.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-[#673ab7] rounded"
                        checked={(answers[q.id]?.split(',') || []).includes(opt ?? '')}
                        onChange={() => toggleCheckbox(q.id, opt ?? '')}
                      />
                      <span className="text-sm text-[#202124]">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-4 px-2">{error}</p>}

        <div className="mt-6 flex justify-between items-center">
          <button className="gform-btn-filled" onClick={handleSubmit}>
            Submit
          </button>
          <button 
            className="gform-btn-text text-sm" 
            onClick={() => setAnswers({})}
          >
            Clear form
          </button>
        </div>
      </div>
    </div>
  )
}