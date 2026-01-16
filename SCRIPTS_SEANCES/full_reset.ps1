
$inputFile = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES\LISTE_COMPLETE.txt"
$baseDir = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES"

# Extended map to handle both correct UTF-8 and ANSI interpretations
$categoryMap = @{
    "DRESSAGE" = "SCRIPTS DRESSAGE"
    "TRAVAIL AU SOL" = "SCRIPTS TRAVAIL_AU_SOL"
    "OBSTACLE" = "SCRIPTS OBSTACLE"
    "CROSS" = "SCRIPTS CROSS_EXTERIEUR"
    "DÉTENTE" = "SCRIPTS DETENTE_BIEN_ETRE"
    "DETENTE" = "SCRIPTS DETENTE_BIEN_ETRE"
    "DÃ‰TENTE" = "SCRIPTS DETENTE_BIEN_ETRE" # Handle ANSI read of UTF8
    "THÉMATIQUE" = "SCRIPTS THEMATIQUE_SPECIFIQUE"
    "THEMATIQUE" = "SCRIPTS THEMATIQUE_SPECIFIQUE"
    "THÃ‰MATIQUE" = "SCRIPTS THEMATIQUE_SPECIFIQUE" # Handle ANSI read of UTF8
    "MISE EN SELLE" = "SCRIPTS MISE EN SELLE"
    "RÉSOLUTION" = "SCRIPTS RESOLUTION_PROBLEME"
    "RESOLUTION" = "SCRIPTS RESOLUTION_PROBLEME"
    "RÃ‰SOLUTION" = "SCRIPTS RESOLUTION_PROBLEME" # Handle ANSI read of UTF8
}

function Get-SafeName ($rawName) {
    if ([string]::IsNullOrWhiteSpace($rawName)) { return "" }
    # Normalize
    $norm = $rawName.Normalize([Text.NormalizationForm]::FormD)
    $ascii = -join ($norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark })
    # Explicitly fix potential mojibake chars if they survived normalization
    $ascii = $ascii -replace "Ã©", "e"
    
    $safe = $ascii -replace "[^a-zA-Z0-9 ]", ""
    return $safe.Replace(" ", "_").ToLower()
}

Write-Host "--- STARTING ROBUST RESET ---"

# Attempt to read as UTF8 first
$lines = Get-Content $inputFile -Encoding UTF8

$validPaths = @{} 
$currentCategoryFolder = ""

foreach ($line in $lines) {
    $line = $line.Trim()
    
    if ($line -match "^=== (.+) ===$") {
        $catName = $matches[1]
        
        # Try finding a matching key
        $folder = ""
        foreach ($key in $categoryMap.Keys) {
            # Use -like for wildcard match if needed, or regex match
            if ($catName -match [Regex]::Escape($key)) {
                $folder = $categoryMap[$key]
                break
            }
        }
        
        if ($folder -ne "") { 
            $currentCategoryFolder = $folder 
            Write-Host "Category Detected: $catName -> $folder"
        } else {
            Write-Host "WARNING: Unrecognized Category: $catName"
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
            
            if (-not (Test-Path $levelDir)) { 
                New-Item -ItemType Directory -Force -Path $levelDir | Out-Null 
            }
            if (-not (Test-Path $fullPath)) {
                "TO_DO : Rédiger le script pour $name ($level)" | Set-Content $fullPath -Encoding UTF8
                Write-Host "Created Correct: $filename in $currentCategoryFolder"
            }
        }
    }
}

# CLEANUP PHASE
Write-Host "--- CLEANING UP MISPLACED FILES ---"
$allTxtFiles = Get-ChildItem -Path $baseDir -Recurse -Filter "*.txt"

foreach ($file in $allTxtFiles) {
    if ($validPaths.ContainsKey($file.FullName)) {
        continue 
    }
    
    # Exclude root and archives
    if ($file.DirectoryName -eq $baseDir) { continue }
    if ($file.FullName -match "_ARCHIVES") { continue }
    
    # Check if empty or TO_DO
    $content = Get-Content $file.FullName -TotalCount 5
    $contentStr = $content -join "`n"
    
    if ($contentStr -match "TO_DO" -or [string]::IsNullOrWhiteSpace($contentStr)) {
        Remove-Item $file.FullName
        Write-Host "DELETED (Misplaced/Duplicate): $($file.Name) from $($file.Directory.Name)"
    }
}

Write-Host "--- FINISHED ---"
