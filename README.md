# Calculator

Screen 1 ডিজাইনের মতো প্রিমিয়াম ডার্ক UI সহ সাধারণ মোবাইল ক্যালকুলেটর। React + Vite + Capacitor দিয়ে Android APK তৈরি করা যায়।

## ফোনে GitHub থেকে ডাউনলোড

1. কোড GitHub-এ push করুন (নিচের গাইড)  
2. `v1.0.0` ট্যাগ push করলে Actions স্বয়ংক্রিয় **Release + APK** বানাবে  
3. ফোনের ব্রাউজারে খুলুন:

   [github.com/Mostafijemon24/premium-calculator/releases/latest](https://github.com/Mostafijemon24/premium-calculator/releases/latest)

4. **Calculator.apk** ডাউনলোড → ইনস্টল করুন  

[![Download APK](https://img.shields.io/github/v/release/Mostafijemon24/premium-calculator?label=Download%20APK)](https://github.com/Mostafijemon24/premium-calculator/releases/latest)

বিস্তারিত ধাপ: **[GITHUB-RELEASE.md](./GITHUB-RELEASE.md)**

## বৈশিষ্ট্য

- যোগ, বিয়োগ, গুণ, ভাগ
- AC, Backspace, শতাংশ (%)
- দশমিক সংখ্যা
- গণনার ইতিহাস (localStorage)
- মোবাইল সেফ-এরিয়া ও টাচ-ফ্রেন্ডলি বাটন

## ওয়েবে চালানো

```bash
cd G:\Calculator
npm install
npm run dev
```

ব্রাউজারে `http://localhost:5173` খুলুন।

## Android APK তৈরি

**প্রয়োজন:** [Node.js](https://nodejs.org), [Android Studio](https://developer.android.com/studio) (SDK একবার সিঙ্ক করুন)

### সবচেয়ে সহজ (সুপারিশ)

```powershell
cd G:\Calculator
npm run android:apk
```

স্ক্রিপ্ট নিজে Android Studio-র Java (`jbr`) ও SDK খুঁজে `local.properties` লিখে APK বানাবে।

### `JAVA_HOME is not set` এর সমাধান

Android Studio ইনস্টল থাকলে **এক লাইনে** (শুধু এই টার্মিনাল সেশন):

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

চিরস্থায়ী সেট (PowerShell **Administrator**):

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
```

টার্মিনাল/Cursor **বন্ধ করে আবার খুলুন**, তারপর:

```powershell
cd G:\Calculator\android
.\gradlew assembleDebug
```

### `SDK location not found` এর সমাধান

`G:\Calculator\android\local.properties` ফাইলে (এক লাইন):

```properties
sdk.dir=C\:\\Users\\YOUR_USER\\AppData\\Local\\Android\\Sdk
```

(`YOUR_USER` আপনার Windows ইউজারনেম)

অথবা Android Studio → **SDK Manager** থেকে SDK একবার ইনস্টল করুন।

APK পাওয়া যাবে: `android\app\build\outputs\apk\debug\app-debug.apk`

### Release APK (প্রকাশের জন্য)

Android Studio খুলুন:

```bash
npm run cap:android
```

**Build → Generate Signed Bundle / APK** থেকে signed release APK তৈরি করুন।

## স্ক্রিপ্ট

| কমান্ড | কাজ |
|--------|-----|
| `npm run dev` | ডেভ সার্ভার |
| `npm run build` | প্রোডাকশন বিল্ড |
| `npm run cap:sync` | বিল্ড + Capacitor সিঙ্ক |
| `npm run android:apk` | Debug APK বিল্ড (Android SDK লাগবে) |
