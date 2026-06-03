# GitHub থেকে ফোনে APK ডাউনলোড

## ১) GitHub-এ প্রজেক্ট আপলোড (একবার)

### A. GitHub-এ নতুন repository

1. [github.com/new](https://github.com/new) খুলুন  
2. Repository name: `premium-calculator` (যেকোনো নাম হতে পারে)  
3. **Public** রাখুন (ফ্রি ডাউনলোড লিংকের জন্য)  
4. README যোগ করবেন না (খালি repo)  
5. **Create repository**

### B. PC থেকে কোড push

PowerShell:

```powershell
cd G:\Calculator
git init
git add .
git commit -m "Premium Calculator — mobile app"
git branch -M main
git remote add origin https://github.com/Mostafijemon24/premium-calculator.git
git push -u origin main
```

প্রোফাইল: [github.com/Mostafijemon24](https://github.com/Mostafijemon24)

> GitHub লগইন লাগলে: Personal Access Token ব্যবহার করুন অথবা GitHub Desktop।

---

## ২) APK বিল্ড ও Release

### দ্রুত প্রথমবার (PC-তে APK আছে)

যদি ইতিমধ্যে `app-debug.apk` বানানো থাকে:

1. GitHub repo → **Releases** → **Create a new release**  
2. Tag: `v1.0.0` → **Publish release**  
3. **Attach binaries** → APK আপলোড করুন, নাম দিন: `PremiumCalculator.apk`  
4. ফোনে: [releases/tag/v1.0.0](https://github.com/Mostafijemon24/premium-calculator/releases/tag/v1.0.0)

### স্বয়ংক্রিয় (GitHub Actions)

### স্বয়ংক্রিয় Release (সুপারিশ)

```powershell
cd G:\Calculator
git tag v1.0.0
git push origin v1.0.0
```

কিছুক্ষণ পর: **GitHub repo → Actions** ট্যাবে বিল্ড সবুজ হলে  
**Releases** এ `PremiumCalculator.apk` থাকবে।

### ম্যানুয়াল বিল্ড (ট্যাগ ছাড়া)

1. Repo → **Actions** → **Build and Release APK**  
2. **Run workflow** → **Run workflow**  
3. বিল্ড শেষে সেই রানে **Artifacts** → `PremiumCalculator-apk` ডাউনলোড

---

## ৩) ফোনে সরাসরি ইনস্টল

### ডাউনলোড লিংক

ব্রাউজারে (Chrome/Firefox):

```
https://github.com/Mostafijemon24/premium-calculator/releases/latest
```

সরাসরি APK (ভার্সন অনুযায়ী):

```
https://github.com/Mostafijemon24/premium-calculator/releases/download/v1.0.0/PremiumCalculator.apk
```

### ইনস্টল ধাপ

1. **PremiumCalculator.apk** ডাউনলোড করুন  
2. **Settings → Security** (বা **Apps**) → **Install unknown apps** → ব্রাউজারকে অনুমতি দিন  
3. নোটিফিকেশন থেকে APK ট্যাপ করে **Install**

---

## ৪) নতুন ভার্সন আপডেট

`package.json` ও `android/app/build.gradle` এ version বাড়ান, তারপর:

```powershell
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

ফোনে আবার **Releases → latest** থেকে নতুন APK ইনস্টল করুন।

---

## README ডাউনলোড ব্যাজ

ইতিমধ্যে README-তে যোগ করা আছে:

[![Download APK](https://img.shields.io/github/v/release/Mostafijemon24/premium-calculator?label=Download%20APK)](https://github.com/Mostafijemon24/premium-calculator/releases/latest)
