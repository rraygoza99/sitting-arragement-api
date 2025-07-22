# Sitting Arrangement API

A Node.js Express API for managing wedding seating arrangements with MongoDB integration, optimized for AWS Amplify deployment.

## Environment Variables

Before deploying to AWS Amplify, make sure to set the following environment variables in your Amplify console:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3000
NODE_ENV=production
```

## AWS Amplify Deployment

### Common 500 Error Fixes

If you're experiencing 500 errors on AWS Amplify, try these solutions:

1. **Environment Variables**: Ensure all required environment variables are set in the Amplify console under "Environment variables" in your app settings.

2. **Build Configuration**: The `amplify.yml` file has been configured to properly build and deploy the Express application.

3. **Proper Environment Handling**: The `scripts/dotenv.js` file provides AWS Amplify-compatible environment variable handling.

### Deployment Steps

1. Connect your repository to AWS Amplify
2. Set environment variables in Amplify console:
   - Go to your app in Amplify console
   - Navigate to "Environment variables" 
   - Add: `MONGODB_URI`, `PORT`, `NODE_ENV`
3. Deploy the application

### Local Development

1. Copy `.env.example` to `.env`
2. Fill in your MongoDB connection string
3. Run `npm install`
4. Run `npm run dev` for development
5. Run `npm run build` for production build

## API Endpoints

- `GET /weddings` - Get all wedding data
- `POST /upload-wedding` - Upload wedding seating data (multipart/form-data)
- `GET /wedding-names` - Get list of wedding names

## Project Structure

```
src/
  index.ts          # Main application file
scripts/
  dotenv.js         # Environment configuration for AWS Amplify
amplify.yml         # AWS Amplify build configuration
```

## Troubleshooting

### 500 Error on Amplify

1. Check CloudWatch logs in AWS console
2. Verify environment variables are set correctly
3. Ensure MongoDB URI is accessible from AWS
4. Check that all dependencies are properly installed during build

### Build Issues

- Make sure TypeScript compiles successfully
- Check that all required dependencies are in `package.json`
- Verify the build artifacts are in the correct location (`dist/`)
