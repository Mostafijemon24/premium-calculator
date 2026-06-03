# Opens GitHub "new repo" page, waits for repo, pushes code and tag for Actions release.
$ErrorActionPreference = "Stop"
$Repo = "premium-calculator"
$Owner = "Mostafijemon24"
$Root = Split-Path $PSScriptRoot -Parent
$ApiUrl = "https://api.github.com/repos/$Owner/$Repo"
$NewRepoUrl = "https://github.com/new?name=$Repo&description=Premium+Calculator+Android+APK&visibility=public"

Set-Location $Root

if (-not (Test-Path ".git")) {
  Write-Error "Git repo নেই। প্রথমে git init করুন।"
}

Write-Host "GitHub-এ repo তৈরি করুন (এক ক্লিক):" -ForegroundColor Cyan
Write-Host $NewRepoUrl
Start-Process $NewRepoUrl

Write-Host ""
Write-Host "অপেক্ষা করছি: $Owner/$Repo তৈরি হওয়া পর্যন্ত..." -ForegroundColor Yellow

$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  try {
    $r = Invoke-RestMethod -Uri $ApiUrl -Method Get -ErrorAction Stop
    if ($r.full_name) {
      $ready = $true
      break
    }
  } catch {
    Start-Sleep -Seconds 5
  }
}

if (-not $ready) {
  Write-Host ""
  Write-Host "Repo এখনও পাওয়া যায়নি। GitHub-এ Create repository চাপুন, তারপর আবার চালান:" -ForegroundColor Red
  Write-Host "  git push -u origin main" -ForegroundColor White
  Write-Host "  git tag v1.0.0" -ForegroundColor White
  Write-Host "  git push origin v1.0.0" -ForegroundColor White
  exit 1
}

Write-Host "Repo পাওয়া গেছে। Push করছি..." -ForegroundColor Green

git remote remove origin 2>$null
git remote add origin "https://github.com/$Owner/$Repo.git"
git push -u origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$tag = "v1.0.0"
git tag -a $tag -m "Release $tag" 2>$null
if ($LASTEXITCODE -ne 0) { git tag $tag -f }
git push origin $tag --force

Write-Host ""
Write-Host "সম্পন্ন! Actions বিল্ড চলবে (২–৫ মিনিট)।" -ForegroundColor Green
Write-Host "https://github.com/$Owner/$Repo/actions"
Write-Host "https://github.com/$Owner/$Repo/releases/latest"
