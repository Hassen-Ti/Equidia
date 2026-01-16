
$inputFile = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES\LISTE_COMPLETE.txt"
$baseDir = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES"

$categoryMap = @{
    "DRESSAGE" = "SCRIPTS DRESSAGE"
    "TRAVAIL AU SOL" = "SCRIPTS TRAVAIL_AU_SOL"
    "OBSTACLE" = "SCRIPTS OBSTACLE"
    "CROSS & EXTÉRIEUR SPORTIF" = "SCRIPTS CROSS_EXTERIEUR"
    "DÉTENTE & BIEN-ÊTRE" = "SCRIPTS DETENTE_BIEN_ETRE"
    "THÉMATIQUE SPÉCIFIQUE" = "SCRIPTS THEMATIQUE_SPECIFIQUE"
    "MISE EN SELLE" = "SCRIPTS MISE EN SELLE"
    "RÉSOLUTION DE PROBLÈME" = "SCRIPTS RESOLUTION_PROBLEME"
}

# Function to sanitize name
function Get-SafeName ($rawName) {
    if ([string]::IsNullOrWhiteSpace($rawName)) { return "" }
    $norm = $rawName.Normalize([Text.NormalizationForm]::FormD)
    $ascii = -join ($norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark })
    $safe = $ascii -replace "[^a-zA-Z0-9 ]", ""
    return $safe.Replace(" ", "_").ToLower()
}

$linesUTF8 = Get-Content $inputFile -Encoding UTF8
$linesANSI = Get-Content $inputFile # Default encoding (likely causing the glitch)

$currentCategoryFolder = ""

for ($i = 0; $i -lt $linesUTF8.Count; $i++) {
    $lineUTF8 = $linesUTF8[$i].Trim()
    $lineANSI = $linesANSI[$i].Trim()
    
    if ($lineUTF8 -match "^=== (.+) ===$") {
        $catName = $matches[1]
        
        # Determine category folder using robust matching
        $folder = ""
        if ($catName -match "DRESSAGE") { $folder = "SCRIPTS DRESSAGE" }
        elseif ($catName -match "TRAVAIL AU SOL") { $folder = "SCRIPTS TRAVAIL_AU_SOL" }
        elseif ($catName -match "OBSTACLE") { $folder = "SCRIPTS OBSTACLE" }
        elseif ($catName -match "CROSS") { $folder = "SCRIPTS CROSS_EXTERIEUR" }
        elseif ($catName -match "DÉTENTE" -or $catName -match "DETENTE") { $folder = "SCRIPTS DETENTE_BIEN_ETRE" }
        elseif ($catName -match "THÉMATIQUE" -or $catName -match "THEMATIQUE") { $folder = "SCRIPTS THEMATIQUE_SPECIFIQUE" }
        elseif ($catName -match "MISE EN SELLE") { $folder = "SCRIPTS MISE EN SELLE" }
        elseif ($catName -match "RÉSOLUTION" -or $catName -match "RESOLUTION") { $folder = "SCRIPTS RESOLUTION_PROBLEME" }
        
        if ($folder -ne "") {
            $currentCategoryFolder = $folder
            $catDir = Join-Path $baseDir $currentCategoryFolder
            if (-not (Test-Path $catDir)) { New-Item -ItemType Directory -Force -Path $catDir | Out-Null }
        }
    }
    elseif ($lineUTF8 -match "^(\d+) - (.+) \((.+)\) - (.+)$") {
        # Proper parsing from UTF8
        $nameUTF8 = $matches[2].Trim()
        $levelUTF8 = $matches[4].Trim()
        
        # Corrupted parsing from ANSI (to find the bad file)
        if ($lineANSI -match "^(\d+) - (.+) \((.+)\) - (.+)$") {
            $nameANSI = $matches[2].Trim()
            $levelANSI = $matches[4].Trim() # Level shouldn't change much as G3-4 has no accents Usually
        } else {
             # Fallback if regex fails on ansi
             $nameANSI = $nameUTF8
             $levelANSI = $levelUTF8
        }
        
        $correctName = Get-SafeName($nameUTF8)
        $badName = Get-SafeName($nameANSI)
        
        $correctFilename = "${correctName}.txt"
        $badFilename = "${badName}.txt"
        
        if ($currentCategoryFolder -ne "") {
            $targetDir = Join-Path $baseDir $currentCategoryFolder
            $targetDir = Join-Path $targetDir $levelUTF8 
            
            if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Force -Path $targetDir | Out-Null }
            
            $correctPath = Join-Path $targetDir $correctFilename
            $badPath = Join-Path $targetDir $badFilename
            
            # If BAD exists and CORRECT does not, Rename
            if ((Test-Path $badPath) -and (-not (Test-Path $correctPath)) -and ($badName -ne $correctName)) {
                Rename-Item -Path $badPath -NewName $correctFilename
                Write-Host "Renamed (Fix): $badFilename -> $correctFilename"
            }
            # If neither exists, Create Correct
            elseif (-not (Test-Path $correctPath)) {
                "TO_DO : Rédiger le script pour $nameUTF8 ($levelUTF8)" | Set-Content $correctPath -Encoding UTF8
                Write-Host "Created: $correctFilename"
            }
            # If both exist? Maybe delete bad?
             elseif ((Test-Path $badPath) -and (Test-Path $correctPath) -and ($badName -ne $correctName)) {
                Remove-Item $badPath
                Write-Host "Removed Duplicate Bad: $badFilename"
            }
        }
    }
}
