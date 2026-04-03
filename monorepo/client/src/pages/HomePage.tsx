import { Link } from 'react-router-dom'
import { useGetFormsQuery } from '../store/enhancedApi'
import { type Form } from '../generated/graphql'
export default function HomePage() {
  const { data, isLoading, isError } = useGetFormsQuery({})

  if (isLoading) return <div className="gform-bg p-8">Loading...</div>
  if (isError) return <div className="gform-bg p-8">Error loading forms.</div>

  return (
    <div className="gform-bg">
      <div className="max-w-5xl mx-auto pt-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl text-[#5f6368]">Recent forms</h1>
          <Link to="/forms/new" className="gform-btn-filled flex items-center gap-2">
            <span className="text-xl">+</span> Blank
          </Link>
        </div>

        {data?.forms.length === 0 ? (
          <div className="gform-card text-center py-20">
            <p className="text-gray-500">No forms yet. Click the + button to start.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
            {data?.forms.map((form: Form) => (
              <div key={form.id} className="group cursor-pointer">
                <div className="bg-white border border-[#dadce0] rounded-t-md h-40 flex items-center justify-center group-hover:border-[#673ab7] transition-colors">
                   <div className="text-[#673ab7] opacity-20">
                     {/* Placeholder for Form Icon */}
                     <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>
                   </div>
                </div>
                <div className="bg-white border-x border-b border-[#dadce0] p-4 rounded-b-md">
                  <h2 className="text-sm font-medium text-[#202124] truncate">{form.title}</h2>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-3">
                      <Link to={`/forms/${form.id}/fill`} className="text-[11px] font-bold text-[#673ab7] hover:underline uppercase">Open</Link>
                      <Link to={`/forms/${form.id}/responses`} className="text-[11px] font-bold text-gray-500 hover:underline uppercase">Responses</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}