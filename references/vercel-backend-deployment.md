# Vercel backend deployment

The public frontend remains a static GitHub Pages deployment at
`https://empresasaludable.com`. Vercel hosts only the Express API exported by
`api/index.ts`; it must not be configured to replace the Pages custom domain.

## Project settings

- Repository: `epac-hub/EmpresaSaludable`
- Root directory: repository root
- Framework preset: Other
- Node.js: 22.x
- API health check: `https://<vercel-project-host>/api/health`

`vercel.json` sends `/api/*` requests to the serverless Express entry point.
The regular `server/_core/index.ts` process remains available for local
development and traditional Node hosting.

## Environment variables

Configure variables in **Vercel → Project → Settings → Environment Variables**.
Set sensitive values directly in Vercel; never commit or paste them into
issues, logs, or build arguments.

| Variable                 | Required for                                                                                                                  | Sensitive |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------- |
| `APP_ORIGIN`             | CORS allowlist and post-login redirect. Set to `https://empresasaludable.com`. Multiple exact origins may be comma-separated. | No        |
| `DATABASE_URL`           | Contact, demo, user, and admin database operations.                                                                           | Yes       |
| `JWT_SECRET`             | Session signing and verification.                                                                                             | Yes       |
| `OWNER_OPEN_ID`          | Initial owner-to-admin role synchronization.                                                                                  | Yes       |
| `OAUTH_SERVER_URL`       | Manus OAuth authentication.                                                                                                   | No        |
| `VITE_APP_ID`            | OAuth application identity expected by the backend.                                                                           | No        |
| `BUILT_IN_FORGE_API_URL` | Optional Manus storage proxy.                                                                                                 | No        |
| `BUILT_IN_FORGE_API_KEY` | Optional Manus storage proxy.                                                                                                 | Yes       |

Apply each value to Preview and Production as appropriate. A deployment can
build without these values, and `/api/health` remains available, but
database-backed and authenticated routes will not be operational.

## Frontend cutover

This change intentionally does not modify the GitHub Pages workflow or point
the static frontend at a preview URL. The existing frontend currently uses its
same-origin tRPC URL and a separate Supabase lead path. Before moving browser
traffic to Vercel, use a stable Vercel production/custom API hostname, configure
`APP_ORIGIN`, update the frontend API/OAuth callback base, and verify
credentialed CORS and login redirects together. Do not use an ephemeral preview
hostname for the production OAuth callback.

## Verification

After the environment is configured:

1. Request `/api/health`; expect `200` and `{"status":"ok"}`.
2. Send a request with `Origin: https://empresasaludable.com`; expect that
   exact `Access-Control-Allow-Origin` value and credential support.
3. Confirm an unrelated `Origin` receives `403`.
4. Verify login, logout, non-admin denial, admin listing, and confirmed deletion
   in Preview before enabling any frontend cutover.
