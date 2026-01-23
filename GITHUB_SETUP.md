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
   - **⚠️ CRITICAL: Before deploying, make sure MongoDB Atlas Network Access is configured!** 
     - Go to MongoDB Atlas → Network Access → Add IP Address → Click "Allow Access from Anywhere" (or add `0.0.0.0/0`)
     - Without this, your Render deployment will fail to connect to MongoDB
     - See troubleshooting section for detailed instructions if you get connection errors

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
   - Select your repository: `mern-ecommerce` (or your actual repo name)
   - Click "Import"

3. **Configure**:
   - **Project Name**: 
     - If your repository name contains uppercase letters or special characters, Vercel will show an error. **Manually change the project name** to use only lowercase letters, numbers, '.', '_', and '-' (e.g., `mern-ecommerce` or `e-commerce`). The project name must be all lowercase!
     - **If you get "The specified name is already used"**: The project name is already taken by another Vercel user. Choose a unique name by:
       - Adding your GitHub username: `frostburn2332-ecommerce` or `frostburn2332-mern-ecommerce`
       - Adding a suffix: `e-commerce-app`, `e-commerce-frontend`, `my-ecommerce-app`
       - Using a more descriptive name: `toy-store-frontend`, `mern-ecommerce-client`
   - **Root Directory**: `client` (IMPORTANT)
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `build` (should auto-detect)

4. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   **Important**: 
   - Replace `https://your-backend-url.onrender.com/api` with your **BACKEND URL** from step 4.1 (the Render deployment)
   - This should be something like: `https://mern-ecommerce-api.onrender.com/api`
   - You do NOT need to put your frontend URL here - Vercel will generate the frontend URL automatically after deployment
   - If you haven't deployed your backend yet, you can add this environment variable later in Vercel's project settings

5. **Click "Deploy"**
   - Wait for deployment (usually 1-3 minutes)
   - Copy your frontend URL (e.g., `https://mern-ecommerce.vercel.app`)

6. **Update Backend CORS** (after frontend is deployed):
   - After Vercel deployment completes, copy your frontend URL (e.g., `https://frostburn2332-ecommerce.vercel.app`)
   - Go back to Render dashboard → Your backend service → Environment
   - Update the `CLIENT_URL` environment variable to your **Vercel frontend URL** (the one you just copied)
   - Save changes (Render will automatically redeploy)
   - **Why?** This allows your backend to accept requests from your frontend (CORS configuration)

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

1. **Update Backend `CLIENT_URL`** (if you skipped step 6 above):
   - Copy your frontend URL from Vercel (e.g., `https://frostburn2332-ecommerce.vercel.app`)
   - Go to Render → Your backend service → Environment
   - Update `CLIENT_URL` to your **frontend URL** (from Vercel)
   - Save changes (Render will automatically redeploy)
   - **This enables CORS** - allows your backend to accept requests from your frontend

2. **Update Frontend `REACT_APP_API_URL`** (only if you didn't set it correctly in step 4):
   - Go to Vercel → Your frontend project → Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your **backend URL** + `/api` (e.g., `https://mern-ecommerce-api.onrender.com/api`)
   - Redeploy the frontend
   - **Note**: This should already be set correctly if you followed step 4 above

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
- **MongoDB connection failed**: See detailed fix below ⬇️
- **CORS errors**: Make sure `CLIENT_URL` matches your frontend URL exactly

#### Fix: MongoDB Atlas Connection Error

If you see this error: *"Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted."*

**Solution - Whitelist All IPs in MongoDB Atlas:**

1. **Go to MongoDB Atlas Dashboard**: 
   - Visit https://cloud.mongodb.com and sign in
   - Select your cluster/project

2. **Navigate to Network Access**:
   - Click on **"Network Access"** in the left sidebar (under "Security")
   - Or go to: https://cloud.mongodb.com/v2#/security/network/whitelist

3. **Add IP Address**:
   - Click the **"Add IP Address"** button (green button)
   - You have two options:

   **Option A: Allow All IPs (Recommended for Render/Railway/Vercel)**:
   - Click **"Allow Access from Anywhere"** button
   - OR manually enter: `0.0.0.0/0`
   - Click **"Confirm"**
   - **Note**: This allows connections from any IP address. For production, you can restrict this later if needed.

   **Option B: Add Specific IPs** (Not recommended for cloud deployments):
   - Enter Render's IP addresses (but Render uses dynamic IPs, so this won't work reliably)
   - This is not recommended for Render deployments

4. **Wait for Changes**:
   - MongoDB Atlas may take 1-2 minutes to apply the network access changes
   - The status will change from "Pending" to "Active"

5. **Verify Your Connection String**:
   - Go to **"Database Access"** → Click **"Connect"** on your cluster
   - Make sure your connection string in Render matches your MongoDB Atlas connection string
   - The connection string should look like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

6. **Redeploy on Render**:
   - After whitelisting, go back to Render dashboard
   - Your service should automatically reconnect, or you may need to manually redeploy
   - Check the logs to confirm the connection is successful

**Why This Happens:**
- MongoDB Atlas blocks all connections by default for security
- Render (and other cloud platforms) use dynamic IP addresses that change
- Whitelisting `0.0.0.0/0` allows connections from any IP, which is necessary for cloud deployments

**Security Note:**
- For production apps, `0.0.0.0/0` is acceptable if you have strong database authentication (username/password)
- Your MongoDB Atlas database is still protected by username/password authentication
- For additional security, you can set up VPC peering or use MongoDB Atlas's built-in firewall rules

### Frontend Issues
- **API calls failing**: Check `REACT_APP_API_URL` is set correctly
- **Build errors**: Check Vercel/Render build logs
- **CORS errors**: Update backend `CLIENT_URL` environment variable
- **Project name error**: If Vercel shows "A Project name can only contain up to 100 lowercase letters, digits, and the characters '.', '_', and '-'":
  - This happens when your GitHub repository name contains uppercase letters
  - **Solution**: When importing to Vercel, manually change the "Project Name" field to use only lowercase letters (e.g., if your repo is `E-commerce`, change the project name to `e-commerce` or `mern-ecommerce`)
  - Alternatively, rename your GitHub repository to use all lowercase letters
- **"The specified name is already used" error**: 
  - This means another Vercel user already has a project with that name
  - **Solution**: Choose a unique project name by adding your GitHub username (e.g., `frostburn2332-ecommerce`), adding a suffix (e.g., `e-commerce-app`), or using a more descriptive name (e.g., `my-mern-ecommerce-frontend`)
  - The project name doesn't need to match your repository name - it's just for Vercel's internal organization

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

