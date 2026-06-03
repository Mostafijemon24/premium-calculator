# Builds debug APK using Android Studio's bundled JDK and local Android SDK.
$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path $PSScriptRoot -Parent
$AndroidDir = Join-Path $ProjectRoot "android"

$JbrCandidates = @(
  "C:\Program Files\Android\Android Studio\jbr",
  "$env:LOCALAPPDATA\Programs\Android\Android Studio\jbr"
)

$SdkCandidates = @(
  "$env:LOCALAPPDATA\Android\Sdk",
  "$env:USERPROFILE\AppData\Local\Android\Sdk"
)

$Jbr = $JbrCandidates | Where-Object { Test-Path "$_\bin\java.exe" } | Select-Object -First 1
$Sdk = $SdkCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $Jbr) {
  Write-Error @"
Java (JDK) পাওয়া যায়নি।
Android Studio ইনস্টল করুন, অথবা JDK 17+ ইনস্টল করে JAVA_HOME সেট করুন।
"@
}

if (-not $Sdk) {
  Write-Error @"
Android SDK পাওয়া যায়নি।
Android Studio খুলে: Settings → Languages & Frameworks → Android SDK
একবার SDK ডাউনলোড/সিঙ্ক করুন।
"@
}

$env:JAVA_HOME = $Jbr
$env:ANDROID_HOME = $Sdk
$env:PATH = "$Jbr\bin;$env:PATH"

$sdkDirProp = ($Sdk -replace '\\', '/')
$localProps = Join-Path $AndroidDir "local.properties"
Set-Content -Path $localProps -Value "sdk.dir=$sdkDirProp" -Encoding ASCII

Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host ""

Set-Location $ProjectRoot
npm run cap:sync
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Set-Location $AndroidDir
.\gradlew assembleDebug
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$Apk = Join-Path $AndroidDir "app\build\outputs\apk\debug\app-debug.apk"
Write-Host ""
Write-Host "APK তৈরি হয়েছে:" -ForegroundColor Green
Write-Host $Apk
