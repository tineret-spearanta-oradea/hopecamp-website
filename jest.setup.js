const dotenv = require('dotenv');

// Load environment variables from .env.local file
// Note: Jest runs from the project root, so the path is correct.
dotenv.config({ path: '.env.local' });

// You can add other global setup here if needed, e.g., global mocks
