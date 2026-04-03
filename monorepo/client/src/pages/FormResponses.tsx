import { useParams, Link } from 'react-router-dom'
import { useGetFormQuery, useGetResponsesQuery } from '../store/enhancedApi'
import { type Answer, type Question, type Response } from '../generated/graphql'
import '../css/forms.css'

export default function FormResponses() {
  const { id } = useParams<{ id: string }>()
  const { data: formData } = useGetFormQuery({ id: id! })
  const { data: responsesData, isLoading } = useGetResponsesQuery({ formId: id! })

  if (isLoading) return <div className="p-8 text-center">Loading...</div>

  const form = formData?.form
  const responses = responsesData?.responses ?? []
  const questionMap = Object.fromEntries(
    form?.questions.map((q: Question) => [q.id, q.text]) ?? []
  )

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link to="/" className="text-purple-700 hover:underline text-sm inline-flex items-center gap-1 mb-4">
        ← Back to Dashboard
      </Link>

      <div className="form-card form-header">
        <h1 className="form-title">{form?.title}</h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
            {responses.length} responses
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {responses.length === 0 ? (
          <div className="form-card text-center text-gray-500">Waiting for responses...</div>
        ) : (
          responses.map((response: Response, i: number) => (
            <div key={response.id} className="form-card">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
                <h3 className="font-medium text-gray-600">Response #{i + 1}</h3>
              </div>
              <div className="space-y-6">
                {response.answers.map((answer: Answer) => (
                  <div key={answer.questionId}>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {questionMap[answer.questionId] ?? "Question Removed"}
                    </p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 italic">
                      {answer.value || <span className="text-gray-400">No response</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}