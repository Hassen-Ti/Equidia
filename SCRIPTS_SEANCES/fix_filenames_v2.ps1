
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

function Get-SafeName ($rawName) {
    if ([string]::IsNullOrWhiteSpace($rawName)) { return "" }
    # Normalize to FormD splits accented chars into Base + Accent
    $norm = $rawName.Normalize([Text.NormalizationForm]::FormD)
    # Filter out the accent marks (NonSpacingMark)
    $ascii = -join ($norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark })
    # Keep only letters, numbers, spaces
    $safe = $ascii -replace "[^a-zA-Z0-9 ]", ""
    # Replace space with underscore and lowercase
    return $safe.Replace(" ", "_").ToLower()
}

# 1. Read Correctly (UTF-8)
$linesUTF8 = Get-Content $inputFile -Encoding UTF8

# 2. Read Incorrectly (ANSI/Default) to simulate the bad names
$linesBad = Get-Content $inputFile -Encoding Default 

$currentCategoryFolder = ""

for ($i = 0; $i -lt $linesUTF8.Count; $i++) {
    $lineUTF8 = $linesUTF8[$i].Trim()
    $lineBad = $linesBad[$i].Trim()
    
    # -------------------------------------------------------------
    # Detect Category (Use valid line to set current folder)
    # -------------------------------------------------------------
    if ($lineUTF8 -match "^=== (.+) ===$") {
        $catName = $matches[1]
        
        $folder = ""
        # Match accurately based on known keywords
        if ($catName -match "DRESSAGE") { $folder = "SCRIPTS DRESSAGE" }
        elseif ($catName -match "TRAVAIL AU SOL") { $folder = "SCRIPTS TRAVAIL_AU_SOL" }
        elseif ($catName -match "OBSTACLE") { $folder = "SCRIPTS OBSTACLE" }
        elseif ($catName -match "CROSS") { $folder = "SCRIPTS CROSS_EXTERIEUR" }
        elseif ($catName -match "DÉTENTE") { $folder = "SCRIPTS DETENTE_BIEN_ETRE" }
        elseif ($catName -match "THÉMATIQUE") { $folder = "SCRIPTS THEMATIQUE_SPECIFIQUE" }
        elseif ($catName -match "MISE EN SELLE") { $folder = "SCRIPTS MISE EN SELLE" }
        elseif ($catName -match "RÉSOLUTION") { $folder = "SCRIPTS RESOLUTION_PROBLEME" }
        
        if ($folder -ne "") {
            $currentCategoryFolder = $folder
        }
    }
    # -------------------------------------------------------------
    # Detect Session and Fix Name
    # -------------------------------------------------------------
    elseif ($lineUTF8 -match "^(\d+) - (.+) \((.+)\) - (.+)$") {
        $nameCorrect = $matches[2].Trim()
        $level = $matches[4].Trim()
        
        # Parse bad name from bad line
        # If regex fails on bad line, fallback to just replacing blindly?
        # Usually checking the ID is safer.
        $id = $matches[1]
        
        $badNameRaw = ""
        if ($lineBad -match "^$id - (.+) \((.+)\) - (.+)$") {
            $badNameRaw = $matches[1].Trim() # Wait, regex index might differ slightly if groups changed? No: id(1), name(2)
            $badNameRaw = $matches[2].Trim()
        }
        
        # Calculate filenames
        $goodSafeName = Get-SafeName($nameCorrect)
        $goodFilename = "${goodSafeName}.txt"
        
        $badSafeName = Get-SafeName($badNameRaw) # Uses the garbage input "DÃ©but" -> "dabut"
        $badFilename = "${badSafeName}.txt"
        
        if ($currentCategoryFolder -ne "") {
            $targetLevelDir = Join-Path $baseDir $currentCategoryFolder
            $targetLevelDir = Join-Path $targetLevelDir $level
            
            $goodPath = Join-Path $targetLevelDir $goodFilename
            $badPath = Join-Path $targetLevelDir $badFilename
            
            # Action: Rename Bad to Good if Bad Matches Correct Pattern of "Incorrectness"
            # And prevent renaming if they are actually the same (no accents)
            
            if ($goodFilename -ne $badFilename) {
                if (Test-Path $badPath) {
                    if (-not (Test-Path $goodPath)) {
                        Rename-Item -Path $badPath -NewName $goodFilename
                        Write-Host "FIXED: $badFilename -> $goodFilename"
                    } else {
                        # Good one already exists? Remove bad one.
                        Remove-Item $badPath
                        Write-Host "REMOVED DUPLICATE: $badFilename"
                    }
                } elseif (-not (Test-Path $goodPath)) {
                     # Neither exist? Create the Good one.
                     if (-not (Test-Path $targetLevelDir)) { New-Item -ItemType Directory -Force -Path $targetLevelDir | Out-Null }
                     "TO_DO : Rédiger le script pour $nameCorrect ($level)" | Set-Content $goodPath -Encoding UTF8
                     Write-Host "CREATED MISSING: $goodFilename"
                }
            } else {
                # Even if names match, ensure file exists
                if (-not (Test-Path $goodPath)) {
                     if (-not (Test-Path $targetLevelDir)) { New-Item -ItemType Directory -Force -Path $targetLevelDir | Out-Null }
                     "TO_DO : Rédiger le script pour $nameCorrect ($level)" | Set-Content $goodPath -Encoding UTF8
                     Write-Host "CREATED MISSING (Simple): $goodFilename"
                }
            }
        }
    }
}
