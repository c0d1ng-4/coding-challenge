const { execSync } = require('child_process');


const BACKEND_URL = 'http://localhost:8000/api/v1/openapi.json';

try {
    console.log('Fetching OpenAPI schema from FastAPI...');
    execSync(`npx openapi-typescript-codegen --input ${BACKEND_URL} --output src/api --client axios`, { stdio: 'inherit' });
    console.log('✅ API client generated successfully!');
} catch (error) {
    console.error('Error generating API client:', error.message);
    console.log('Ensure your FastAPI server is running at: ' + BACKEND_URL);
    process.exit(1);
}