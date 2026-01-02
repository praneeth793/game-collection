# Build APK Using GitHub Actions (No Download Required!)

This guide shows you how to build your Android APK using GitHub's free cloud servers. **You only upload the code (small) and download the APK (small) - GitHub handles the 2GB+ Android SDK download!**

## Option 1: Using GitHub Web (Easiest - No Git Installation)

### Step 1: Create GitHub Account
1. Go to https://github.com
2. Sign up for free account

### Step 2: Create New Repository
1. Click the "+" button → "New repository"
2. Name: `game-collection`
3. Make it **Public** or **Private** (both work)
4. DO NOT check "Add a README file"
5. Click "Create repository"

### Step 3: Upload Files
You'll upload the `android-app` folder:

1. Click "uploading an existing file"
2. Drag and drop the entire `android-app` folder
3. Or click "choose your files" and select all contents of `android-app`
4. Scroll down and click "Commit changes"

### Step 4: Trigger Auto-Build
1. Go to your repository → "Actions" tab
2. You should see "Build Android APK" workflow running
3. Click on it to watch progress
4. Wait for "Build" job to complete (5-10 minutes)

### Step 5: Download APK
1. In the workflow run, scroll to "Artifacts" section
2. Click "game-collection-apk"
3. Download `app-debug.apk` (file will be ~15-30MB)
4. Transfer to your phone and install!

---

## Option 2: Using Git Bash (If You Want Version Control)

### Step 1: Install Git for Windows
Download from: https://git-scm.com/download/win

### Step 2: Open Git Bash
1. Right-click the `android-app` folder
2. Select "Git Bash Here"

### Step 3: Initialize Repository
```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - 22 game collection"

# Create GitHub repository first, then:
git remote add origin https://github.com/YOURUSERNAME/game-collection.git
git branch -M main
git push -u origin main
```

### Step 4: Trigger Build
1. Go to https://github.com/YOURUSERNAME/game-collection/actions
2. Watch the build run
3. Download APK from Artifacts

---

## After Installation on Phone

### Enable Unknown Sources
1. Settings → Security → Enable "Unknown sources"
2. OR: When installing, tap "Settings" → "Install anyway"

### Install APK
1. Open the downloaded APK file
2. Tap "Install"
3. Launch "Game Collection" app!

---

## Quick Reference

| Action | Steps |
|--------|-------|
| **First Build** | Upload to GitHub → Wait 5-10 min → Download APK |
| **Update Games** | Replace files in android-app folder → Commit → Push → Download new APK |
| **Build Size** | ~15-30MB APK file |
| **Internet Used** | ~5-10MB upload + ~30MB download |
| **Time to Build** | ~5-10 minutes on GitHub servers |

---

## Troubleshooting

### "Workflow not running"
- Go to Actions tab → Click "I understand my workflows" → Enable

### Build Failed
- Check the error in the workflow log
- Common issue: Repository upload incomplete - try re-uploading

### Can't Download APK
- Make sure you're logged into GitHub
- Artifacts expire after 5 days (30 days for releases)

### Installation Blocked on Phone
- Enable "Install from unknown sources" in phone Settings → Security
- Or: Open APK with "Install anyway" option

---

## What Gets Built

Your APK includes:
- ✓ 22 complete games
- ✓ Touch-optimized controls
- ✓ Offline play support
- ✓ Haptic feedback
- ✓ Professional UI

---

## Need Help?

1. **GitHub Help**: https://docs.github.com
2. **GitHub Actions**: https://docs.github.com/en/actions
3. **Common Issues**: Check the Actions tab for error logs

---

## Alternative: Build Locally (Requires ~3GB Download)

If you prefer to build locally later:

```powershell
# Install requirements (one-time)
winget install Microsoft.OpenJDK.17
winget install Google.AndroidStudio

# Open Android Studio
# File → Open → Select "android-app/android"
# Build → Generate Signed APK
```

But GitHub Actions is FREE and saves you 3GB+ of downloads!
