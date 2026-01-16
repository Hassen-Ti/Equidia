
$baseDir = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES"

# 1. MOVE "WEIRD" LEVELS TO STANDARD LEVELS (Lowest bound rule)
# G5-7 -> G5-6
# G3+ -> G3-4
# G7+ -> Remains G7+ (Standard)
# G6-7 -> Remains G6-7 (Standard)

function Move-LevelContent ($parentCatDir, $sourceLevel, $targetLevel) {
    $sourceDir = Join-Path $parentCatDir $sourceLevel
    $targetDir = Join-Path $parentCatDir $targetLevel
    
    if (Test-Path $sourceDir) {
        if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Force -Path $targetDir | Out-Null }
        
        Get-ChildItem -Path $sourceDir -File | ForEach-Object {
            $destFile = Join-Path $targetDir $_.Name
            if (-not (Test-Path $destFile)) {
                Move-Item -Path $_.FullName -Destination $targetDir
                Write-Host "MOVED: $($_.Name) from $sourceLevel to $targetLevel"
            } else {
                Write-Host "SKIPPED: $($_.Name) already exists in $targetLevel"
                Remove-Item $_.FullName
            }
        }
        # Delete source if empty
        if ((Get-ChildItem -Path $sourceDir).Count -eq 0) {
            Remove-Item $sourceDir
            Write-Host "REMOVED EMPTY FOLDER: $sourceDir"
        }
    }
}

$catFolders = Get-ChildItem -Path $baseDir -Directory

foreach ($cat in $catFolders) {
    # Apply specific moves
    Move-LevelContent $cat.FullName "G5-7" "G5-6"
    Move-LevelContent $cat.FullName "G3+" "G3-4"
    
    # Generic loop to remove ANY empty folder
    Get-ChildItem -Path $cat.FullName -Directory | ForEach-Object {
        if ((Get-ChildItem -Path $_.FullName -Recurse).Count -eq 0) {
            Remove-Item $_.FullName -Recurse
            Write-Host "REMOVED EMPTY FOLDER (Generic): $($_.FullName)"
        }
    }
}
