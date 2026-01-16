
$baseDir = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES"
$stats = @{
    TotalFiles = 0
    ReadyToRecord = 0
    Drafts = 0
    EmptyOrPlaceholder = 0
}

$report = @()

Get-ChildItem -Path $baseDir -Recurse -File -Include *.txt | ForEach-Object {
    if ($_.Name -eq "LISTE_COMPLETE.txt" -or $_.Name -eq "PROMPTS_RECUPERES.txt") { return }
    
    $stats.TotalFiles++
    $content = Get-Content $_.FullName -Raw
    
    if ([string]::IsNullOrWhiteSpace($content) -or $content -match "TO_DO") {
        $stats.EmptyOrPlaceholder++
    } elseif ($content -match "\[PAUSE") {
        $stats.ReadyToRecord++
        $report += "[READY] $($_.Name)"
    } else {
        $stats.Drafts++
        # $report += "[DRAFT] $($_.Name)" # Uncomment to see drafts
    }
}

Write-Host "=== ÉTAT DES LIEUX DES SCRIPTS ==="
Write-Host "Total Fichiers  : $($stats.TotalFiles)"
Write-Host "Prêts (Pauses)  : $($stats.ReadyToRecord)"
Write-Host "Brouillons      : $($stats.Drafts)"
Write-Host "Vides/To-Do     : $($stats.EmptyOrPlaceholder)"
Write-Host ""
Write-Host "--- Liste des Scripts Prêts ---"
$report | ForEach-Object { Write-Host $_ }
