
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

# Get list of all valid category folders
$allCatFolders = $categoryMap.Values | Sort-Object -Unique

function Get-SafeName ($rawName) {
    if ([string]::IsNullOrWhiteSpace($rawName)) { return "" }
    $norm = $rawName.Normalize([Text.NormalizationForm]::FormD)
    $ascii = -join ($norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark })
    $safe = $ascii -replace "[^a-zA-Z0-9 ]", ""
    return $safe.Replace(" ", "_").ToLower()
}

$lines = Get-Content $inputFile -Encoding UTF8

$currentCorrectFolder = ""

foreach ($line in $lines) {
    if ($line -match "^=== (.+) ===$") {
        $catName = $matches[1]
        
        $folder = ""
        if ($catName -match "DRESSAGE") { $folder = "SCRIPTS DRESSAGE" }
        elseif ($catName -match "TRAVAIL AU SOL") { $folder = "SCRIPTS TRAVAIL_AU_SOL" }
        elseif ($catName -match "OBSTACLE") { $folder = "SCRIPTS OBSTACLE" }
        elseif ($catName -match "CROSS") { $folder = "SCRIPTS CROSS_EXTERIEUR" }
        elseif ($catName -match "DÉTENTE" -or $catName -match "DETENTE") { $folder = "SCRIPTS DETENTE_BIEN_ETRE" }
        elseif ($catName -match "THÉMATIQUE" -or $catName -match "THEMATIQUE") { $folder = "SCRIPTS THEMATIQUE_SPECIFIQUE" }
        elseif ($catName -match "MISE EN SELLE") { $folder = "SCRIPTS MISE EN SELLE" }
        elseif ($catName -match "RÉSOLUTION" -or $catName -match "RESOLUTION") { $folder = "SCRIPTS RESOLUTION_PROBLEME" }
        
        $currentCorrectFolder = $folder
    }
    elseif ($line -match "^(\d+) - (.+) \((.+)\) - (.+)$") {
        $name = $matches[2].Trim()
        $level = $matches[4].Trim()
        
        $safeName = Get-SafeName($name)
        $filename = "${safeName}.txt"
        
        if ($currentCorrectFolder -ne "") {
            # Check all other folders for this file
            foreach ($otherFolder in $allCatFolders) {
                if ($otherFolder -ne $currentCorrectFolder) {
                    $otherPath = Join-Path $baseDir $otherFolder
                    $otherPath = Join-Path $otherPath $level
                    $otherFile = Join-Path $otherPath $filename
                    
                    if (Test-Path $otherFile) {
                        Remove-Item $otherFile
                        Write-Host "Removed misplaced file: $otherFile"
                    }
                }
            }
        }
    }
}
