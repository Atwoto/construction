# Environment Configuration

## Production Environment (.env.production)
```
REACT_APP_API_URL=/api
REACT_APP_USE_MOCK_AUTH=false
```

## Development Environment (.env)
```
REACT_APP_API_URL=/api
REACT_APP_USE_MOCK_AUTH=false
```

Note: The `/api` path will be handled by Vercel's rewrites configuration which routes `/api/*` requests to the serverless functions.