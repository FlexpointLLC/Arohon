# Connect Sanity Canvas to Your Embedded Studio

So Canvas can see your embedded Studio (and you stop seeing "Unable to find any deployed studios"), do the following.

## 1. Add your Studio URL in Sanity Manage

1. Open **[sanity.io/manage](https://sanity.io/manage)** and select the **Arohon** project.
2. Go to **Project settings** (or **Studios**).
3. Add the **canonical Studio URL** for this project. Use the full URL where your Studio is available, including the path:
   - **Production:** `https://blogs.arohon.co/studio`
   - If you use a different blog domain, use that base URL + `/studio`.

Canvas and Dashboard use this URL to discover your studio and load the manifest at `/studio/static/create-manifest.json`.

## 2. Deploy schema and manifest (one-time / after schema changes)

The manifest is already generated in `public/studio/static/`. To **deploy the schema** to your dataset (so Canvas can read your content model):

1. Log in to Sanity (if needed):
   ```bash
   npx sanity login
   ```
2. Deploy schema and update manifest:
   ```bash
   npm run studio:deploy
   ```

For **CI/CD** (e.g. Vercel), add a deploy token in [Sanity Manage → API](https://sanity.io/manage) and run:

```bash
SANITY_AUTH_TOKEN=<deploy_token> npm run studio:deploy
```

You can run this before `next build` so the manifest in `public/studio/static/` is up to date on deploy.

## 3. Deploy your app

Ensure your app (e.g. **blogs.arohon.co**) is deployed so that:

- The Studio is reachable at `https://blogs.arohon.co/studio`.
- The manifest is reachable at `https://blogs.arohon.co/studio/static/create-manifest.json`.

After the next deploy, Canvas should detect your studio and the "Not connected" message should go away.

## Summary

| Step | Action |
|------|--------|
| 1 | In [sanity.io/manage](https://sanity.io/manage), set Studio URL to `https://blogs.arohon.co/studio` (or your blog base URL + `/studio`). |
| 2 | Run `npx sanity login` then `npm run studio:deploy` (and in CI use `SANITY_AUTH_TOKEN`). |
| 3 | Deploy your Next app so `/studio` and `/studio/static/create-manifest.json` are live. |

The **Dashboard bridge script** is already added in `app/studio/layout.tsx`, so no extra code is required for that.
