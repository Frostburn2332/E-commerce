# Deployment Guide

This document contains instructions for deploying the MERN E-commerce application to production.

## Changes Made for Deployment

### Backend Changes
1. ✅ Updated `server/config/db.js` to use MongoDB Atlas connection string from environment variable
2. ✅ Updated `server/server.js` to:
   - Load environment variables using `dotenv`
   - Configure CORS to accept requests from the frontend URL
   - Added health check endpoint at `/health`
3. ✅ Created `server/.env` file with MongoDB Atlas connection string

### Frontend Changes
1. ✅ Created `client/src/config/api.js` for centralized API URL configuration
2. ✅ Updated all client files to use the API config instead of hardcoded URLs:
   - `client/src/context/AuthContext.js`
   - `client/src/services/productService.js`
   - `client/src/components/products/CategorySection.js`
   - `client/src/pages/ProductsPage.js`
   - `client/src/pages/CheckoutPage.js`
   - `client/src/pages/admin/AdminLogin.js`
   - `client/src/pages/admin/AdminDashboard.js`
   - `client/src/pages/admin/AdminOrders.js`
3. ✅ Created `client/.env` file with API URL

## MongoDB Atlas Connection

The MongoDB Atlas connection string has been configured:
```
mongodb+srv://adityagoudar671_db_user:CDGxf8JDBXOS6H6Q@m0.ciaymwd.mongodb.net/toystore?retryWrites=true&w=majority
```

## Deployment Steps

### 1. Deploy Backend to Render/Railway

#### Option A: Render (Free Tier - Spins down after 15 min inactivity)
1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `mern-ecommerce-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave blank (or set to `server` if deploying from server folder)
5. Add Environment Variables:
   ```
   PORT=5001
   MONGODB_URI=mongodb+srv://adityagoudar671_db_user:CDGxf8JDBXOS6H6Q@m0.ciaymwd.mongodb.net/toystore?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=30d
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
6. Click "Create Web Service"
7. Copy the backend URL (e.g., `https://mern-ecommerce-api.onrender.com`)

#### Option B: Railway (Always-on Free Tier)
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add the same environment variables as above
5. Deploy

### 2. Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up
2. Click "New Project" → "Import Git Repository"
3. Select your repository
4. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   (Replace with your actual backend URL from step 1)
6. Click "Deploy"

### 3. Update Environment Variables

After both deployments:

1. **Update Backend CORS**:
   - In Render/Railway dashboard, update `CLIENT_URL` environment variable to your Vercel frontend URL
   - Redeploy the backend

2. **Update Frontend API URL** (if needed):
   - In Vercel dashboard, update `REACT_APP_API_URL` to your backend URL + `/api`
   - Redeploy the frontend

## Environment Variables Summary

### Backend (.env or Render/Railway)
```
PORT=5001
MONGODB_URI=mongodb+srv://adityagoudar671_db_user:CDGxf8JDBXOS6H6Q@m0.ciaymwd.mongodb.net/toystore?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d
NODE_ENV=production
CLIENT_URL=https://your-vercel-app.vercel.app
```

### Frontend (.env or Vercel)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Testing Deployment

1. **Test Backend Health Check**:
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try registering a new user
   - Try logging in
   - Browse products
   - Add items to cart
   - Place an order

3. **Test Admin Panel**:
   - Visit: `https://your-vercel-url.vercel.app/admin/login`
   - Login with admin credentials
   - Check dashboard and orders

## Important Notes

1. **MongoDB Atlas**: Make sure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` (all IPs) in Network Access settings.

2. **JWT Secret**: Change the `JWT_SECRET` to a strong, random string in production. Never commit this to Git.

3. **CORS**: The backend is configured to accept requests from the frontend URL specified in `CLIENT_URL`.

4. **Environment Variables**: Never commit `.env` files to Git. They are already in `.gitignore`.

5. **Render Free Tier**: The free tier spins down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds.

## Troubleshooting

### Backend Issues
- Check Render/Railway logs for errors
- Verify MongoDB Atlas connection string is correct
- Ensure all environment variables are set
- Check that MongoDB Atlas allows connections from all IPs

### Frontend Issues
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Ensure backend CORS allows your frontend URL
- Check Vercel build logs for errors

### Database Issues
- Verify MongoDB Atlas cluster is running
- Check network access settings in MongoDB Atlas
- Verify connection string credentials are correct

## Support

For issues or questions, check:
- Render Documentation: https://render.com/docs
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com

