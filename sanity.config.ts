import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'arohon-blog',
  title: 'Arohon Blog',
  projectId: 'pfm6u125',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
