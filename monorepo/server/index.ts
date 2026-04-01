import express from 'express'
import cors from 'cors'
import { createHandler } from 'graphql-http/lib/use/express'
import { makeExecutableSchema } from '@graphql-tools/schema'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

interface Question{
  id: string,
  text: string,
  type: 'TEXT'| 'MULTIPLE_CHOICE'|'CHECKBOX'|'DATE',
  options?: string[]
}

interface Form {
  id: string,
  title:string,
  description?: string,
  questions: Question[]
}

interface Answer{
  questionId: string,
  value:string
}

interface Response{
  id: string,
  formId: string,
  answers: Answer[]
}

const forms: Form[] = []
const responses: Response[] = []

const typeDefs = `
  enum QuestionType{
  TEXT
  MULTIPLE_CHOICE
  CHECKBOX
  DATE
  }

  type Question{
  id: ID!
  text: String!
  type: QuestionType!
  options: [String]
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Answer {
    questionId: ID!
    value: String!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  #INPUTS

  input QuestionInput {
    text: String!
    type: QuestionType!
    options: [String]
  }

  input AnswerInput {
    questionId: ID!
    value: String!
  }

  #QUERIES

  type Query{
  forms: [Form!]!
  form(id: ID!): Form
  responses(formId: ID!): [Response!]!
  }

  #MUTATIONS
  
  type Mutation {
    createForm(
      title: String!
      description: String
      questions: [QuestionInput]
    ): Form!

    submitResponse(
      formId: ID!
      answers: [AnswerInput]!
    ): Response!
  }

`

const resolvers = {
  Query: {
    forms: () => forms,

    form: (_: unknown, { id }: { id: string }) =>
      forms.find(f => f.id === id) ?? null,

    responses: (_: unknown, { formId }: { formId: string }) =>
      responses.filter(r => r.formId === formId),
  },

  Mutation: {
    createForm: (
      _: unknown,
      {
        title,
        description,
        questions,
      }: {
        title: string
        description?: string
        questions?: Omit<Question, 'id'>[]
      }
    ) => {
      const newForm: Form = {
        id: Date.now().toString(),
        title,
        description,
        // Each question gets its own unique ID
        questions: (questions ?? []).map((q, index) => ({
          ...q,
          id: `${Date.now()}-${index}`,
        })),
      }
      forms.push(newForm)
      return newForm
    },

    submitResponse: (
      _: unknown,
      { formId, answers }: { formId: string; answers: Answer[] }
    ) => {
      const form = forms.find(f => f.id === formId)
      if (!form) throw new Error(`Form with id ${formId} not found`)

      const newResponse: Response = {
        id: Date.now().toString(),
        formId,
        answers: answers ?? [],
      }
      responses.push(newResponse)
      return newResponse
    },
  },
}



const schema = makeExecutableSchema({ typeDefs, resolvers })
app.use('/graphql', createHandler({ schema }))

app.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`)
})