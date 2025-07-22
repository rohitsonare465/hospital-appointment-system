# Deployment Guide for Hospital Appointment System

## Prerequisites

1. **MongoDB Atlas Account**: You'll need a MongoDB Atlas cluster for the database
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment

### 1. Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster or use an existing one
3. Create a database user with read/write permissions
4. Get your connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/hospital-appointment-system`)
5. Whitelist Vercel's IP addresses or allow access from anywhere (0.0.0.0/0) for simplicity

### 2. Deploy to Vercel

#### Method 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From your project root directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to existing project or create new
   - Set up build settings (should auto-detect)

#### Method 2: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Connect your Git repository
4. Vercel will auto-detect the framework settings

### 3. Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

**Production Environment Variables:**
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/hospital-appointment-system
JWT_SECRET=your-super-secret-jwt-key-for-production-make-it-long-and-random
JWT_EXPIRES_IN=90d
NODE_ENV=production
REACT_APP_API_URL=https://your-vercel-app.vercel.app/api
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important Notes:**
- Replace `your-username`, `your-password`, and `your-cluster` with your actual MongoDB Atlas credentials
- Generate a strong JWT secret (you can use online generators)
- Replace `your-vercel-app` with your actual Vercel app name

### 4. Update Project Configuration

The following files have been configured for Vercel deployment:

- `vercel.json` - Vercel deployment configuration
- Updated service files to use environment variables
- Updated CORS configuration in backend
- Added build scripts

### 5. Deploy

After setting up environment variables:

1. Push your changes to your Git repository
2. Vercel will automatically redeploy your application
3. Your app will be available at `https://your-project-name.vercel.app`

## Testing the Deployment

1. Visit your Vercel app URL
2. Test user registration and login
3. Test appointment booking and management
4. Verify that all API endpoints are working

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure the `FRONTEND_URL` environment variable is set correctly

2. **Database Connection Issues**: 
   - Verify MongoDB connection string
   - Check MongoDB Atlas network access settings
   - Ensure database user has correct permissions

3. **API Routes Not Working**:
   - Check that `vercel.json` is in the root directory
   - Verify the routes configuration

4. **Build Failures**:
   - Check that all dependencies are listed in package.json
   - Verify that environment variables are set

### Checking Logs:

- Visit your Vercel dashboard
- Go to your project
- Click on a deployment to see build and runtime logs

## Environment Variables Reference

### Backend Variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT token expiration time
- `NODE_ENV`: Environment (production)
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend Variables:
- `REACT_APP_API_URL`: Backend API URL

## Security Considerations

1. **JWT Secret**: Use a strong, random secret key
2. **MongoDB**: Don't use default credentials
3. **CORS**: Configure specific domains instead of allowing all
4. **Environment Variables**: Never commit secrets to version control

## Monitoring and Maintenance

1. Monitor your Vercel deployment logs
2. Set up MongoDB Atlas monitoring
3. Regular dependency updates
4. Monitor API usage and performance

---

Your Hospital Appointment System is now ready for deployment to Vercel!
