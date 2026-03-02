import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';

// Add your Studio URL (e.g. https://arohon.co/studio, https://blogs.arohon.co/studio) to
// Sanity project CORS origins with authenticated requests enabled: https://www.sanity.io/docs/content-lake/cors

export default defineConfig({
  name: 'arohon-blog',
  title: 'Arohon Blog',
  projectId: 'pfm6u125',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  deployment: {
    appId: 'v2x8mg63ld1ft19d7ipmzbsx',
    autoUpdates: true,
  },
});
