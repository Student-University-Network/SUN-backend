# SUN-backend

Backend for SUN

## Roadmap

-   [ ] Base
    -   [ ] Authentication
    -   [ ] Users

## Environment Variables

|       Variable       |                Description                |                 Values                  |
| :------------------: | :---------------------------------------: | :-------------------------------------: |
|       NODE_ENV       |             Node environment              | `production`, `testing`, `development`  |
|     DATABASE_URL     |            Local/Cloud DB URL             | `mysql://username:password@host/dbname` |
| ACCESS_TOKEN_SECRET  |                JWT SECRET                 |         random 64 bytes string          |
| REFRESH_TOKEN_SECRET |                JWT SECRET                 |         random 64 bytes string          |
| ACCESS_TOKEN_EXPIRY  | Access token expriy in seconds or minutes |                  `15m`                  |
