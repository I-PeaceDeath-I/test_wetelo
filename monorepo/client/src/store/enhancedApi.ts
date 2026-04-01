import { api as generatedApi } from '../generated/graphql'

export const api = generatedApi.enhanceEndpoints({
  endpoints: {
    // Queries: provide tags so RTK Query knows what data they represent
    GetForms: {
      providesTags: ['Form'],
    },
    GetForm: {
      providesTags: (_result, _error, { id }) => [{ type: 'Form', id }],
    },
    GetResponses: {
      providesTags: (_result, _error, { formId }) => [{ type: 'Response', id: formId }],
    },

    // Mutations: invalidate tags so affected queries automatically refetch
    CreateForm: {
      invalidatesTags: ['Form'],
    },
    SubmitResponse: {
      invalidatesTags: (_result, _error, { formId }) => [{ type: 'Response', id: formId }],
    },
  },
})

export const {
  useGetFormsQuery,
  useLazyGetFormsQuery,
  useGetFormQuery,
  useLazyGetFormQuery,
  useCreateFormMutation,
  useGetResponsesQuery,
  useLazyGetResponsesQuery,
  useSubmitResponseMutation,
} = api