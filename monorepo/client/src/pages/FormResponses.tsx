import { useParams, Link } from 'react-router-dom'
import { useGetFormQuery, useGetResponsesQuery } from '../store/enhancedApi'
import { type Answer, type Question, type Response } from '../generated/graphql'

export default function FormResponses() {
  const { id } = useParams<{ id: string }>()
  const { data: formData } = useGetFormQuery({ id: id! })
  const { data: responsesData, isLoading } = useGetResponsesQuery({ formId: id! })

  if (isLoading) return <p className="p-6">Loading responses...</p>

  const form = formData?.form
  const responses = responsesData?.responses ?? []
  const questionMap = Object.fromEntries(
    form?.questions.map((q: Question) => [q.id, q.text]) ?? []
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-blue-500 hover:underline text-sm">← Back</Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">{form?.title} — Responses</h1>
      <p className="text-gray-500 mb-6">{responses.length} response(s)</p>

      {responses.length === 0 && (
        <p className="text-gray-400">No responses yet.</p>
      )}

      <div className="space-y-6">
  {responses.map((response: Response, i: number) => (
    <div key={response.id} className="border rounded p-4">
      <h2 className="font-semibold mb-3 text-gray-700">Response #{i + 1}</h2>
      <div className="space-y-2">
        {/* 2. Explicitly type 'answer' here */}
        {response.answers.map((answer: Answer) => (
          <div key={answer.questionId}>
            <p className="text-sm text-gray-500">
              {questionMap[answer.questionId] ?? answer.questionId}
            </p>
            <p className="font-medium">{answer.value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
    </div>
  )
}
