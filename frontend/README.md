# Frontend

This folder contains the frontend application built with Next.js. It provides a user interface for interacting with the backend API.

## Features
- Server-side rendering with Next.js
- API client generation from OpenAPI schema
- Responsive design

## Setup
1. Install dependencies: `yarn install`
2. Run the development server: `yarn dev`

## API Generation
The API client is generated using the OpenAPI schema from the backend. To generate the client, run the following command:

```bash
yarn generate-api
```

This command executes the `generate-api.js` script, which fetches the OpenAPI schema and generates the TypeScript client code using `openapi-typescript-codegen`.
