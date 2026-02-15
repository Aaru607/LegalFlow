# 🚀 Deployment Guide for LegalFlow

This guide walks you through deploying LegalFlow to Vercel with MongoDB Atlas and Clerk authentication.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ MongoDB Atlas account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- ✅ Clerk account ([clerk.com](https://clerk.com))

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create an account
3. Click "Build a Database"
4. Choose **FREE** tier (M0)
5. Select a cloud provider and region (choose closest to your users)
6. Name your cluster (e.g., "legalflow-cluster")
7. Click "Create"

### 1.2 Create Database User

1. Click "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Set "Database User Privileges" to "Read and write to any database"
6. Click "Add User"

### 1.3 Whitelist IP Addresses

1. Click "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development)
   - Or add your specific IP for production
4. Click "Confirm"

### 1.4 Get Connection String

1. Go back to "Database" (Clusters)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `myFirstDatabase` with `legalflow`

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/legalflow?retryWrites=true&w=majority
```

---

## Step 2: Set Up Clerk

### 2.1 Create Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click "Add application"
3. Name it "LegalFlow"
4. Choose authentication methods (Email, Google, etc.)
5. Click "Create application"

### 2.2 Get API Keys

1. In the Clerk dashboard, go to "API Keys"
2. Copy:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2.3 Configure URLs (Do this AFTER deploying to Vercel)

You'll need to come back and add these URLs after deployment:
- Sign in URL: `https://your-app.vercel.app/sign-in`
- Sign up URL: `https://your-app.vercel.app/sign-up`
- After sign in URL: `https://your-app.vercel.app/dashboard`
- After sign up URL: `https://your-app.vercel.app/dashboard`

---

## Step 3: Push Code to GitHub

### 3.1 Initialize Git Repository

```bash
cd legalflow-engine
git init
git add .
git commit -m "Initial commit: LegalFlow task management system"
```

### 3.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it "legalflow-engine"
4. Make it **Public** (or Private if you have Pro)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 3.3 Push Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/legalflow-engine.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Click "Import" on "legalflow-engine"

### 4.2 Configure Build Settings

Vercel should auto-detect Next.js settings:
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

### 4.3 Add Environment Variables

Click "Environment Variables" and add these:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/legalflow?retryWrites=true&w=majority
```

### 4.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Get your deployment URL (e.g., `https://legalflow-engine.vercel.app`)

---

## Step 5: Update Clerk URLs

### 5.1 Configure Redirect URLs

1. Go back to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "Paths" in the sidebar
4. Update these URLs with your Vercel domain:

**Sign in URL:**
```
https://your-app.vercel.app/sign-in
```

**Sign up URL:**
```
https://your-app.vercel.app/sign-up
```

**After sign in:**
```
https://your-app.vercel.app/dashboard
```

**After sign up:**
```
https://your-app.vercel.app/dashboard
```

### 5.2 Add Authorized Domains

1. Go to "Domains" in Clerk dashboard
2. Add your Vercel domain: `your-app.vercel.app`

---

## Step 6: Test Deployment

### 6.1 Test Authentication

1. Visit your deployed URL
2. Click "Sign Up"
3. Create an account
4. Verify you're redirected to dashboard

### 6.2 Test Task Creation

1. Create 2-3 tasks
2. Verify they appear in the UI
3. Check MongoDB Atlas to see data

### 6.3 Test Dependencies

1. Create a dependency between tasks
2. Verify sorting works
3. Test cycle detection

---

## 🔧 Troubleshooting

### Build Failed

**Error**: `Module not found`
```bash
# Solution: Check package.json dependencies are correct
npm install
npm run build
```

### Clerk Authentication Error

**Error**: `Clerk: Invalid publishable key`
- Double-check environment variables in Vercel
- Make sure keys don't have extra spaces
- Verify keys match your Clerk application

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError`
- Check connection string is correct
- Verify password doesn't contain special characters (use URL encoding)
- Ensure IP whitelist includes `0.0.0.0/0` in MongoDB Atlas
- Check cluster is running

### Page Not Found

**Error**: 404 on routes
- Make sure middleware.ts is configured correctly
- Verify Clerk paths match your environment variables
- Check that all pages are in correct folders

---

## 🔄 Updating Deployment

### After Code Changes

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel automatically rebuilds and deploys!

### Update Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Update or add variables
5. Redeploy from "Deployments" tab

---

## 🌟 Custom Domain (Optional)

### 6.1 Add Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update Clerk URLs with new domain

---

## 📊 Monitoring

### Vercel Analytics

1. Go to your project in Vercel
2. Click "Analytics" tab
3. View page views, performance metrics

### MongoDB Metrics

1. Go to MongoDB Atlas
2. Click your cluster
3. View "Metrics" tab for database performance

### Clerk Dashboard

1. Go to Clerk Dashboard
2. View user signups and activity

---

## ✅ Production Checklist

Before sharing your deployment:

- [ ] Application loads without errors
- [ ] Authentication works (sign up, sign in, sign out)
- [ ] Tasks can be created and deleted
- [ ] Dependencies can be added and removed
- [ ] Topological sorting works correctly
- [ ] Cycle detection prevents circular dependencies
- [ ] Mobile responsive design works
- [ ] Toast notifications appear correctly
- [ ] MongoDB data persists across sessions
- [ ] Environment variables are set correctly

---

## 🎉 You're Done!

Your LegalFlow application is now live! Share your URL:

```
https://your-app.vercel.app
```

---

## 📝 Submission Checklist

For the assessment, make sure you have:

1. ✅ **GitHub Repository**: Public repo with all code
2. ✅ **Demo Video**: YouTube unlisted link
3. ✅ **Live Deployment**: Vercel URL (optional but recommended)
4. ✅ **README**: Clear setup instructions
5. ✅ **Working Features**: All required functionality

---

Need help? Check the README.md or open an issue on GitHub!
