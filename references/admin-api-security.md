# Admin API security and deployment configuration

The `admin.listSubmissions` and `admin.deleteSubmission` tRPC procedures expose
contact-submission PII and therefore require an authenticated user whose
database role is `admin`. A browser-only password gate is not an authorization
boundary.

## Required deployment configuration

Configure these values in the server deployment's secret/environment settings:

| Variable | Secret | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | MySQL connection containing the `users` and `contact_submissions` tables. |
| `JWT_SECRET` | Yes | High-entropy key used to sign and verify session cookies. Use a unique production value and rotate it if exposed. |
| `OWNER_OPEN_ID` | Yes | Exact Manus OAuth `openId` of the owner who should receive the `admin` role. |
| `OAUTH_SERVER_URL` | No | Manus OAuth service base URL for the deployment environment. |
| `VITE_APP_ID` | No | Application ID expected in OAuth sessions; it must match the deployed Manus application. |

Do not expose `DATABASE_URL`, `JWT_SECRET`, or `OWNER_OPEN_ID` through
client-prefixed variables or commit their values to the repository.

After setting `OWNER_OPEN_ID`, the owner must sign in through Manus OAuth. The
existing user synchronization promotes that matching user to `admin`; all other
authenticated users remain unauthorized. Verify the resulting `users.role`
value before enabling operational use of the admin API.

## Deletion contract

Deletion requires all of the following:

1. A valid authenticated session.
2. The `admin` database role.
3. A positive 32-bit submission ID.
4. The literal confirmation value `DELETE`.

The API deletes only the row matching that primary key. It returns `NOT_FOUND`
when no row was affected instead of reporting a false success. Clients should
prompt the operator for confirmation and send:

```json
{
  "id": 123,
  "confirmation": "DELETE"
}
```
