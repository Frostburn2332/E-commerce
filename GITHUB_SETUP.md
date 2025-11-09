# GitHub Setup Guide

This guide will walk you through putting your MERN e-commerce project on GitHub and deploying it to Render.

## Step 1: Create a GitHub Repository

1. **Go to GitHub**: Visit https://github.com and sign in (or create an account if you don't have one)

2. **Create a new repository**:
   - Click the "+" icon in the top right corner
   - Select "New repository"
   - Repository name: `mern-ecommerce` (or any name you prefer)
   - Description: "MERN E-commerce Application"
   - Choose **Public** or **Private** (Private is recommended for projects with sensitive data)
   - **DO NOT** initialize with README, .gitignore, or license (since you already have these)
   - Click "Create repository"

3. **Copy the repository URL**: GitHub will show you a URL like:
   - `https://github.com/your-username/mern-ecommerce.git` (HTTPS)
   - or `git@github.com:your-username/mern-ecommerce.git` (SSH)

## Step 2: Connect Your Local Repository to GitHub

Run these commands in your terminal (replace `your-username` and `mern-ecommerce` with your actual GitHub username and repository name):

```bash
cd /Users/adityagoudar/Documents/Proj1/mern-ecommerce

# Add the remote repository (use HTTPS URL from GitHub)
git remote add origin https://github.com/your-username/mern-ecommerce.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**Note**: If you haven't set up Git credentials, GitHub will prompt you for your username and password (or Personal Access Token).

### Setting up GitHub Authentication

If you get authentication errors:

1. **For HTTPS**: You'll need a Personal Access Token
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Give it a name and select scopes: `repo` (full control of private repositories)
   - Copy the token and use it as your password when pushing

2. **For SSH** (Alternative):
   ```bash
   # Generate SSH key (if you don't have one)
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Add SSH key to GitHub
   # Copy the public key: cat ~/.ssh/id_ed25519.pub
   # Then add it to GitHub → Settings → SSH and GPG keys
   
   # Use SSH URL instead
   git remote set-url origin git@github.com:your-username/mern-ecommerce.git
   ```

## Step 3: Verify Your Code is on GitHub

1. Go to your repository on GitHub: `https://github.com/your-username/mern-ecommerce`
2. You should see all your files there
3. Verify that `node_modules` are NOT in the repository (they should be in `.gitignore`)

## Step 4: Deploy to Render

Now that your code is on GitHub, you can deploy it to Render:

### 4.1 Deploy Backend Server

1. **Go to Render**: Visit https://render.com and sign up/login (you can use your GitHub account)

2. **Create a Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account (if not already connected)
   - Select your repository: `mern-ecommerce`
   - Click "Connect"

3. **Configure the Backend Service**:
   - **Name**: `mern-ecommerce-api` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server` (IMPORTANT: This tells Render where your backend code is)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if you want)

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=30d
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
   
   **Important**: 
   - Get your MongoDB Atlas connection string from your MongoDB Atlas dashboard
   - Generate a strong random string for `JWT_SECRET` (you can use: `openssl rand -base64 32`)
   - Set `CLIENT_URL` after you deploy your frontend (see step 4.2)

5. **Click "Create Web Service"**
   - Render will start building and deploying your backend
   - Wait for deployment to complete (usually 2-5 minutes)
   - Copy your backend URL (e.g., `https://mern-ecommerce-api.onrender.com`)

### 4.2 Deploy Frontend (Optional - if you want to deploy frontend too)

You can deploy the frontend to Vercel, Netlify, or Render:

#### Option A: Deploy to Vercel (Recommended for React apps)

1. **Go to Vercel**: Visit https://vercel.com and sign up/login (use GitHub)

2. **Import Project**:
   - Click "New Project"
   - Select your repository: `mern-ecommerce`
   - Click "Import"

3. **Configure**:
   - **Root Directory**: `client` (IMPORTANT)
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `build` (should auto-detect)

4. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   (Replace with your actual backend URL from step 4.1)

5. **Click "Deploy"**
   - Wait for deployment (usually 1-3 minutes)
   - Copy your frontend URL (e.g., `https://mern-ecommerce.vercel.app`)

6. **Update Backend CORS**:
   - Go back to Render dashboard
   - Update the `CLIENT_URL` environment variable to your Vercel frontend URL
   - Redeploy the backend

#### Option B: Deploy Frontend to Render

1. **Create a Static Site**:
   - In Render dashboard, click "New +" → "Static Site"
   - Connect your repository: `mern-ecommerce`

2. **Configure**:
   - **Name**: `mern-ecommerce-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

3. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Click "Create Static Site"**

## Step 5: Update Environment Variables

After deploying both backend and frontend:

1. **Update Backend `CLIENT_URL`**:
   - Go to Render → Your backend service → Environment
   - Update `CLIENT_URL` to your frontend URL
   - Save changes (Render will automatically redeploy)

2. **Update Frontend `REACT_APP_API_URL`** (if needed):
   - Go to Vercel/Render → Your frontend → Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your backend URL + `/api`
   - Redeploy

## Step 6: Test Your Deployment

1. **Test Backend**:
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**:
   - Visit your frontend URL
   - Try registering a user
   - Try logging in
   - Browse products
   - Add items to cart

## Important Notes

1. **MongoDB Atlas**: Make sure your MongoDB Atlas cluster allows connections from all IPs (`0.0.0.0/0`) in Network Access settings.

2. **Environment Variables**: Never commit `.env` files to GitHub. They are already in `.gitignore`.

3. **Render Free Tier**: 
   - Backend services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds (cold start)
   - Consider upgrading to paid plan for always-on service

4. **Security**:
   - Use strong, random values for `JWT_SECRET`
   - Never expose sensitive data in your code
   - Keep your MongoDB credentials secure

## Troubleshooting

### Git Push Issues
- **Authentication failed**: Set up Personal Access Token or SSH keys
- **Repository not found**: Check repository name and URL
- **Permission denied**: Make sure you have write access to the repository

### Render Deployment Issues
- **Build failed**: Check Render logs for errors
- **Environment variables not working**: Make sure they're set in Render dashboard, not just in `.env` file
- **MongoDB connection failed**: Verify MongoDB Atlas network access allows all IPs
- **CORS errors**: Make sure `CLIENT_URL` matches your frontend URL exactly

### Frontend Issues
- **API calls failing**: Check `REACT_APP_API_URL` is set correctly
- **Build errors**: Check Vercel/Render build logs
- **CORS errors**: Update backend `CLIENT_URL` environment variable

## Next Steps

- Set up custom domains (optional)
- Set up CI/CD for automatic deployments
- Monitor your application with logging
- Set up database backups
- Configure SSL certificates (usually automatic)

## Useful Commands

```bash
# Check git status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Check remote repository
git remote -v

# View commit history
git log
```

## Resources

- [GitHub Documentation](https://docs.github.com)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

**Your repository is now ready for deployment!** 🚀

