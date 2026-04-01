import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../src/generated/graphql.ts');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(
  /export const \w+Document = new TypedDocumentString\(`[\s\S]*?`\);\n?/g,
  ''
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Removed TypedDocumentString duplicates from graphql.ts');
