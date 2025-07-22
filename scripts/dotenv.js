const dotenv = require('dotenv');
const path = require('path');

// Configuration for AWS Amplify environment variable handling
function configureEnvironment() {
  // Load environment variables based on the environment
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // For AWS Amplify, environment variables are injected at build time
  // But we still want to support local development
  if (nodeEnv === 'development') {
    // Try to load from .env.local first (for local development)
    const localEnvPath = path.resolve(process.cwd(), '.env.local');
    dotenv.config({ path: localEnvPath });
    
    // Fallback to .env file
    const envPath = path.resolve(process.cwd(), '.env');
    dotenv.config({ path: envPath });
  }
  
  // Validate required environment variables
  const requiredVars = [
    'MONGODB_URI',
    'PORT'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    // Don't throw error in production as Amplify might inject variables differently
    if (nodeEnv === 'development') {
      console.error('Please check your .env file configuration');
    }
  }
  
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // Add other environment variables as needed
  };
}

module.exports = {
  configureEnvironment,
  // Export individual variables for backwards compatibility
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};