import { Link } from 'react-router-dom'
import { useGetFormsQuery } from '../store/enhancedApi'
import { type Form } from '../generated/graphql'

export default function HomePage() {
  const { data, isLoading, isError } = useGetFormsQuery({})

  if (isLoading) return <p>Loading forms...</p>
  if (isError) return <p>Failed to load forms.</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Forms</h1>
        <Link
          to="/forms/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New Form
        </Link>
      </div>

      {data?.forms.length === 0 && (
        <p className="text-gray-500">No forms yet. Create one!</p>
      )}

      <ul className="space-y-4">
        {data?.forms.map((form: Form) => (
          <li key={form.id} className="border rounded p-4">
            <h2 className="text-lg font-semibold">{form.title}</h2>
            {form.description && (
              <p className="text-gray-600 text-sm mb-2">{form.description}</p>
            )}
            <div className="flex gap-4 mt-2">
              <Link
                to={`/forms/${form.id}/fill`}
                className="text-blue-600 hover:underline text-sm"
              >
                Fill Out
              </Link>
              <Link
                to={`/forms/${form.id}/responses`}
                className="text-green-600 hover:underline text-sm"
              >
                View Responses
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}