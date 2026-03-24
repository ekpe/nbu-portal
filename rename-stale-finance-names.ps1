# rename-stale-finance-names.ps1

$root = Join-Path (Get-Location) "src"

if (-not (Test-Path $root)) {
    Write-Error "Could not find src folder at: $root"
    exit 1
}

# Ordered list of replacements (no duplicate key issue)
$replacements = @(
    @{ pattern = '\bprisma\.financialOverride\b'; replace = 'prisma.financeOverrideRequest' },
    @{ pattern = '\bprisma\.registrationHold\b'; replace = 'prisma.financeHold' },
    @{ pattern = '\bprisma\.studentFeeProfile\b'; replace = 'prisma.studentFinanceAccount' },
    @{ pattern = '\bprisma\.feeProfile\b'; replace = 'prisma.studentFinanceAccount' },

    @{ pattern = '\bfinancialOverride\b'; replace = 'financeOverrideRequest' },
    @{ pattern = '\bFinancialOverride\b'; replace = 'FinanceOverrideRequest' },

    @{ pattern = '\bregistrationHold\b'; replace = 'financeHold' },
    @{ pattern = '\bRegistrationHold\b'; replace = 'FinanceHold' },

    @{ pattern = '\bstudentFeeProfileId\b'; replace = 'studentProfileId' },
    @{ pattern = '\bStudentFeeProfileId\b'; replace = 'StudentProfileId' },

    @{ pattern = '\bstudentFeeProfile\b'; replace = 'studentFinanceAccount' },
    @{ pattern = '\bStudentFeeProfile\b'; replace = 'StudentFinanceAccount' },

    @{ pattern = '\bfeeProfileId\b'; replace = 'studentFinanceAccountId' },
    @{ pattern = '\bFeeProfileId\b'; replace = 'StudentFinanceAccountId' },

    @{ pattern = '\bfeeProfile\b'; replace = 'studentFinanceAccount' },
    @{ pattern = '\bFeeProfile\b'; replace = 'StudentFinanceAccount' }
)

$files = Get-ChildItem -Path $root -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx

$changedFiles = @()

foreach ($file in $files) {
    $original = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $updated = $original

    foreach ($r in $replacements) {
        $updated = [regex]::Replace($updated, $r.pattern, $r.replace)
    }

    if ($updated -ne $original) {
        $backupPath = "$($file.FullName).bak"
        Copy-Item -Path $file.FullName -Destination $backupPath -Force
        Set-Content -Path $file.FullName -Value $updated -Encoding UTF8
        $changedFiles += $file.FullName
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Done." -ForegroundColor Cyan
Write-Host "Changed files: $($changedFiles.Count)" -ForegroundColor Yellow

if ($changedFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review changes: git diff"
    Write-Host "2. Run: npx prisma generate"
    Write-Host "3. Run: npm run build"
}