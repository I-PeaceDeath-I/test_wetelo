import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        {
          'typescript-rtk-query': {
            importBaseApiFrom: '../store/baseApi',
            exportHooks: true,
          },
        },
        'typed-document-node',
      ],
    },
  },
  hooks: {
    afterAllFileWrite: ['node scripts/fix-generated-graphql.mjs'],
  },
};

export default config;