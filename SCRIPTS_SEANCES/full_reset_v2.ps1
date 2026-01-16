
$inputFile = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES\LISTE_COMPLETE.txt"
$baseDir = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES"

$categoryMap = @{
    "DRESSAGE" = "SCRIPTS DRESSAGE"
    "TRAVAIL AU SOL" = "SCRIPTS TRAVAIL_AU_SOL"
    "OBSTACLE" = "SCRIPTS OBSTACLE"
    "CROSS" = "SCRIPTS CROSS_EXTERIEUR"
    "DETENTE" = "SCRIPTS DETENTE_BIEN_ETRE"
    "THEMATIQUE" = "SCRIPTS THEMATIQUE_SPECIFIQUE"
    "MISE EN SELLE" = "SCRIPTS MISE EN SELLE"
    "RESOLUTION" = "SCRIPTS RESOLUTION_PROBLEME"
}

function Remove-Diacritics ($text) {
    if ([string]::IsNullOrEmpty($text)) { return $text }
    $norm = $text.Normalize([Text.NormalizationForm]::FormD)
    $chars = $norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark }
    return (-join $chars).ToUpper()
}

function Get-SafeName ($rawName) {
    if ([string]::IsNullOrWhiteSpace($rawName)) { return "" }
    $clean = Remove-Diacritics $rawName
    # Only keep letters numbers
    $safe = $clean -replace "[^A-Z0-9 ]", ""
    return $safe.Replace(" ", "_").ToLower()
}

Write-Host "--- SYSTEMATIC RESET ---"

$lines = Get-Content $inputFile -Encoding UTF8
$validPaths = @{}
$currentCategoryFolder = ""

foreach ($line in $lines) {
    $line = $line.Trim()
    
    if ($line -match "^=== (.+) ===$") {
        $catRaw = $matches[1]
        $catClean = Remove-Diacritics $catRaw
        
        $folder = ""
        foreach ($key in $categoryMap.Keys) {
            # Match if CLEANED category contains the KEY (e.g. "DETENTE & BIEN-ETRE" contains "DETENTE")
            if ($catClean -match $key) {
                $folder = $categoryMap[$key]
                break
            }
        }
        
        if ($folder -ne "") {
            $currentCategoryFolder = $folder
            Write-Host "Category OK: $catRaw -> $folder"
        } else {
             Write-Host "Category FAIL: $catRaw (Cleaned: $catClean)"
        }
    }
    elseif ($line -match "^(\d+) - (.+) \((.+)\) - (.+)$") {
        $name = $matches[2].Trim()
        $level = $matches[4].Trim()
        
        $safeName = Get-SafeName($name)
        $filename = "${safeName}.txt"
        
        if ($currentCategoryFolder -ne "") {
             $catDir = Join-Path $baseDir $currentCategoryFolder
             $levelDir = Join-Path $catDir $level
             $fullPath = Join-Path $levelDir $filename
             
             $validPaths[$fullPath] = 1
             
             if (-not (Test-Path $levelDir)) { New-Item -ItemType Directory -Force -Path $levelDir | Out-Null }
             if (-not (Test-Path $fullPath)) {
                 "TO_DO : Rédiger le script pour $name ($level)" | Set-Content $fullPath -Encoding UTF8
                 Write-Host "CREATED: $filename in $currentCategoryFolder"
             }
        }
    }
}

Write-Host "--- PURGING INVALID FILES ---"
$allFiles = Get-ChildItem -Path $baseDir -Recurse -Filter "*.txt"

foreach ($file in $allFiles) {
    if ($validPaths.ContainsKey($file.FullName)) { continue }
    if ($file.DirectoryName -eq $baseDir) { continue }
    if ($file.FullName -match "_ARCHIVES") { continue }
    
    $c = Get-Content $file.FullName -TotalCount 5 | Out-String
    if ($c -match "TO_DO" -or [string]::IsNullOrWhiteSpace($c)) {
        Remove-Item $file.FullName
        Write-Host "REMOVED: $($file.Name) from $($file.Directory.Name)"
    }
}
