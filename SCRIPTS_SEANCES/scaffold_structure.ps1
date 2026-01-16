
$inputFile = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES\LISTE_COMPLETE.txt"
$baseDir = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES"

$currentCategoryFolder = ""

# Lire le fichier ligne par ligne
# On n'impose pas UTF8 en lecture pour laisser PowerShell detecter, 
# mais on gere les accents via regex souple pour les categories.
Get-Content $inputFile | ForEach-Object {
    $line = $_.Trim()
    
    # Détecter les catégories (=== CAT ===)
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

        if ($folder -ne "") {
            $currentCategoryFolder = $folder
            Write-Host "Catégorie : $currentCategoryFolder"
            
            # S'assurer que le dossier de catégorie existe
            $catDir = Join-Path $baseDir $currentCategoryFolder
            if (-not (Test-Path $catDir)) {
                 New-Item -ItemType Directory -Force -Path $catDir | Out-Null
            }
        }
    }
    # Détecter les séances (ID - Nom (Durée) - Niveau)
    elseif ($line -match "^(\d+) - (.+) \((.+)\) - (.+)$") {
        $name = $matches[2].Trim()
        $level = $matches[4].Trim()
        
        # Normalisation du nom de fichier
        # On remplace les accents par des caracteres simples si possible, ou on les garde si le FS le supporte.
        # Pour eviter les bugs d'encodage regex, on utilise une méthode .NET
        
        $norm = $name.Normalize([Text.NormalizationForm]::FormD)
        $ascii = -join ($norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark })
        
        # Garder a-z, 0-9 et espace
        $safeName = $ascii -replace "[^a-zA-Z0-9 ]", ""
        $safeName = $safeName.Replace(" ", "_").ToLower()
        
        $filename = "${safeName}.txt"
        
        if ($currentCategoryFolder -ne "") {
            $targetDir = Join-Path $baseDir $currentCategoryFolder
            $targetDir = Join-Path $targetDir $level
            
            # Créer le dossier niveau s'il n'existe pas
            if (-not (Test-Path $targetDir)) {
                New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
            }
            
            $targetFile = Join-Path $targetDir $filename
            
            # Créer le fichier vide s'il n'existe pas
            if (-not (Test-Path $targetFile)) {
                "TO_DO : Rédiger le script pour $name ($level)" | Set-Content $targetFile -Encoding UTF8
                Write-Host "Created : $filename"
            }
        }
    }
}
