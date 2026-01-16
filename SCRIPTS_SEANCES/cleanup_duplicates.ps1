
$baseDir = "c:\Users\TTM\Desktop\equicoach\SCRIPTS_SEANCES"

# --- HELPER FUNCTIONS ---

function Normalize-Content ($filePath) {
    if (-not (Test-Path $filePath)) { return "" }
    return Get-Content $filePath -Raw
}

function Keep-Best-File ($goodFile, $badFile) {
    if ((Test-Path $goodFile) -and (Test-Path $badFile)) {
        Write-Host "Keeping BEST: $(Split-Path $goodFile -Leaf)"
        Write-Host "Removing BAD: $(Split-Path $badFile -Leaf)"
        
        # Ensure good file has content if bad file was the only one with content
        # (Though logic below assumes goodFile IS the one with content or we are merging)
        
        Remove-Item $badFile -Force
    }
}

function Merge-And-Clean ($targetFile, $sourceFile) {
    # If target is empty placeholder and source has content, move content to target
    if ((Test-Path $targetFile) -and (Test-Path $sourceFile)) {
        $tLen = (Get-Item $targetFile).Length
        $sLen = (Get-Item $sourceFile).Length
        
        if ($tLen -lt 100 -and $sLen -gt 100) {
            Write-Host "Updating Placeholder: $(Split-Path $targetFile -Leaf) with content from $(Split-Path $sourceFile -Leaf)"
            Copy-Item $sourceFile $targetFile -Force
            Remove-Item $sourceFile
        } elseif ($tLen -gt 100 -and $sLen -gt 100) {
            # Both have content -> Prefer specific "corrigé" ones or just keep target if manually selected?
            # For this specific task, User asked to check duplicates.
            # We will list conflicts for logic below.
        } elseif ($sLen -lt 100) {
             # Source is empty, just delete it
             Remove-Item $sourceFile
        }
    }
}

# --- DRESSAGE DUPLICATES FIX ---

# G2-3: Decouverte dressage
$p1 = Join-Path $baseDir "SCRIPTS DRESSAGE\G2-3\Decouverte_dressage_corrigé_avec_pause.txt"
$p2 = Join-Path $baseDir "SCRIPTS DRESSAGE\G2-3\seance_decouverte_dressage.txt"
Merge-And-Clean $p2 $p1 # Move content to the standard name 'seance_decouverte_dressage.txt'

# G2-3: Souplesse laterale
$p1 = Join-Path $baseDir "SCRIPTS DRESSAGE\G2-3\Souplesse_Laterale_Debutant_avec_pause.txt"
$p2 = Join-Path $baseDir "SCRIPTS DRESSAGE\G2-3\souplesse_laterale__debutant.txt"
Merge-And-Clean $p2 $p1

# G3-4: Impulsion au trot
$p1 = Join-Path $baseDir "SCRIPTS DRESSAGE\G3-4\impulsion_au_trot_corrigé_avec_pause.txt"
$p2 = Join-Path $baseDir "SCRIPTS DRESSAGE\G3-4\impulsion_au_trot.txt"
Merge-And-Clean $p2 $p1

# G5-6: Cessions
$p1 = Join-Path $baseDir "SCRIPTS DRESSAGE\G5-6\Cessions_à_la_jambe_corrigé_avec_pauses.txt"
$p2 = Join-Path $baseDir "SCRIPTS DRESSAGE\G5-6\cessions_a_la_jambe__pas_et_trot.txt"
Merge-And-Clean $p2 $p1

# G7+: Epaule en dedans
$p1 = Join-Path $baseDir "SCRIPTS DRESSAGE\G7+\Epaule_en_dedans_corrigé_avec_pause.txt"
$p2 = Join-Path $baseDir "SCRIPTS DRESSAGE\G7+\epaule_en_dedans__introduction.txt"
Merge-And-Clean $p2 $p1

# --- THEMATIQUE SPECIFIQUE FIX ---

# G4-5 Engagement posterieurs
$p1 = Join-Path $baseDir "SCRIPTS THEMATIQUE_SPECIFIQUE\G4-5\Engagement_des_posterieurs_avec_pause.txt"
$p2 = Join-Path $baseDir "SCRIPTS THEMATIQUE_SPECIFIQUE\G4-5\engagement_des_posterieurs.txt"
Merge-And-Clean $p2 $p1

# G4-5 Variations amplitude
$p1 = Join-Path $baseDir "SCRIPTS THEMATIQUE_SPECIFIQUE\G4-5\Variations_damplitudes_avec_pause.txt"
$p2 = Join-Path $baseDir "SCRIPTS THEMATIQUE_SPECIFIQUE\G4-5\variations_damplitude.txt"
Merge-And-Clean $p2 $p1

# --- TRAVAIL AU SOL FIX ---

# G2-3 Longe
$p1 = Join-Path $baseDir "SCRIPTS TRAVAIL_AU_SOL\G2-3\1_Longe_débutant_Les_bases.txt"
$p2 = Join-Path $baseDir "SCRIPTS TRAVAIL_AU_SOL\G2-3\longe_debutant__les_bases.txt"
Merge-And-Clean $p2 $p1

# G3-4 Gymnastique sol
$p1 = Join-Path $baseDir "SCRIPTS TRAVAIL_AU_SOL\G3-4\2_Gymnastique_au_sol.txt"
$p2 = Join-Path $baseDir "SCRIPTS TRAVAIL_AU_SOL\G3-4\gymnastique_au_sol.txt"
Merge-And-Clean $p2 $p1

# G4-5 Longe transitions
$p1 = Join-Path $baseDir "SCRIPTS TRAVAIL_AU_SOL\G4-5\Longe_avec_transition.txt"
$p2 = Join-Path $baseDir "SCRIPTS TRAVAIL_AU_SOL\G4-5\longe_avec_transitions.txt"
Merge-And-Clean $p2 $p1

# G7+ Longues renes
$p1 = Join-Path $baseDir "SCRIPTS TRAVAIL_AU_SOL\G7+\Longues_rênes_introduction.txt"
$p2 = Join-Path $baseDir "SCRIPTS TRAVAIL_AU_SOL\G7+\longues_renes__introduction.txt"
Merge-And-Clean $p2 $p1

# --- OBSTACLE FIX ---

# G3-4 Ligne obstacles
$p1 = Join-Path $baseDir "SCRIPTS OBSTACLE\G3-4\ligne_dobstacles_simples.txt" # Typo in name sometimes
$p2 = Join-Path $baseDir "SCRIPTS OBSTACLE\G3-4\ligne_obstacles_simples.txt"
Merge-And-Clean $p2 $p1

# Final cleanup of any lingering empty files if a "good" one exists nearby?
# For now, explicit merging is safer to avoid deleting good content manually placed in bad filenames.

Write-Host "Duplicate Cleanup Complete."
