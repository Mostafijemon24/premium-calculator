# Tags and pushes a version to trigger GitHub Actions APK release.
param(
  [Parameter(Mandatory = $true)]
  [string]$Version
)

$ErrorActionPreference = "Stop"
$tag = if ($Version.StartsWith("v")) { $Version } else { "v$Version" }

Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Test-Path ".git")) {
  Write-Error "Git repo নেই। আগে: git init && git remote add origin <url>"
}

$status = git status --porcelain
if ($status) {
  Write-Host "Uncommitted changes — commit করছি..." -ForegroundColor Yellow
  git add .
  git commit -m "Release $tag"
}

git tag -a $tag -m "Release $tag" -f 2>$null
if ($LASTEXITCODE -ne 0) {
  git tag $tag -f
}

Write-Host "Pushing tag $tag ..." -ForegroundColor Cyan
git push origin main
git push origin $tag --force

Write-Host ""
Write-Host "GitHub Actions বিল্ড শুরু হবে।" -ForegroundColor Green
Write-Host "কিছুক্ষণ পর Releases চেক করুন:"
Write-Host "https://github.com/Mostafijemon24/premium-calculator/releases/tag/$tag"
