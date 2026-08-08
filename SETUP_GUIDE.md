# 🚀 CodeGuardian AI - Setup Guide

## ✅ Current Status

Your application is **running successfully**!

- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:8000
- **Status**: Ready for use (with demo mode)

---

## 🔧 To Enable Full Functionality (MongoDB)

### Step 1: Get Your MongoDB Connection String

1. Go to your MongoDB Atlas dashboard (you're already logged in!)
2. Click **"Database"** in the left sidebar
3. Click **"Connect"** button next to your cluster
4. Select **"Connect your application"**
5. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Update the .env File

1. Open `/backend/.env` file
2. Replace the `MONGO_URI` line with your connection string:
   ```env
   MONGO_URI=mongodb+srv://username:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/codeguardian?retryWrites=true&w=majority
   ```
3. Make sure to:
   - Replace `<password>` with your actual MongoDB password
   - Keep `/codeguardian` at the end (database name)
   - Keep `?retryWrites=true&w=majority` at the end

### Step 3: Restart Backend

The backend server will automatically restart when you save the .env file.

---

## 🎨 What's Working Now

Even without MongoDB, you can explore:

✅ **Landing Page** - Beautiful animations, particle effects
✅ **UI Components** - All glassmorphism effects and transitions
✅ **Navigation** - Smooth page transitions
✅ **Forms** - All validation and animations
✅ **Layouts** - Responsive design on all screens

---

## 📝 Optional: Enable GitHub OAuth (For GitHub Login)

### Get GitHub OAuth Credentials:

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: CodeGuardian AI Local
   - **Homepage URL**: http://localhost:5174
   - **Authorization callback URL**: http://localhost:8000/api/auth/github/callback
4. Click **"Register application"**
5. Copy the **Client ID** and **Client Secret**

### Update .env:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

---

## 🤖 Optional: Enable AI Features

To use the AI Assistant and Code Fixer with real AI:

1. Get a Groq API key from https://console.groq.com
2. Update .env:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

---

## 🎯 Quick Access

- **Application**: http://localhost:5174
- **API Docs**: http://localhost:8000/api-docs (if Swagger is configured)
- **Backend Health**: http://localhost:8000/health

---

## 🐛 Troubleshooting

### "MongoDB Connection Error"
- This is normal if MongoDB is not configured yet
- The app will still run with limited functionality
- Follow Step 1-3 above to fix

### "Port already in use"
- The app will automatically try the next available port
- Check the terminal output for the actual port number

### Backend Crashes
- Make sure all environment variables are set in `.env`
- Check the terminal for error messages
- Try `npm install` again in the backend folder

---

## 💡 Tips

1. **MongoDB is optional for UI testing** - You can explore all pages and animations without it
2. **GitHub OAuth is optional** - You can use email/password registration instead
3. **AI features are optional** - The app will show demo data without Groq API key

---

## 🎉 Enjoy Your App!

Your CodeGuardian AI is ready with:
- ✨ Modern animations
- 🎨 Glassmorphism design
- 📱 Mobile responsive
- 🚀 Professional UI/UX

Start exploring at: **http://localhost:5174**
