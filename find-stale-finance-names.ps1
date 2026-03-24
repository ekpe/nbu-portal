# find-stale-finance-names.ps1
$root = Join-Path (Get-Location) "src"
$patterns = @(
    'financialOverride',
    'registrationHold',
    'studentFeeProfile',
    'feeProfile'
)

Get-ChildItem -Path $root -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx |
    Select-String -Pattern $patterns |
    ForEach-Object {
        "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()
    }