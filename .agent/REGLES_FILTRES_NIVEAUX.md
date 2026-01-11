# 🎯 RÈGLES DE FILTRAGE PAR NIVEAU - EQUICOACH

**Document de référence pour le développement de l'application**

---

## 📋 PRINCIPE GÉNÉRAL - OPTION C (RETENUE)

### Filtre avec toggle "Inclure niveaux inférieurs"

**Interface utilisateur :**
```
Niveau : [G4-5 ▼]
☐ Inclure les niveaux inférieurs
```

**Comportement :**
- **Par défaut (toggle décoché)** : Affiche UNIQUEMENT les séances du niveau sélectionné
- **Toggle coché** : Affiche le niveau sélectionné + tous les niveaux inférieurs
- **Catégorie "Résolution de problème"** : TOUJOURS VISIBLE (pas de niveau)

---

## 🔍 LOGIQUE DE FILTRE AVEC TOGGLE

### Exemple 1 : Cavalier sélectionne **G4-5**

**Toggle DÉCOCHÉ (par défaut) :**
- ✅ Séances G4-5 uniquement
- ❌ Séances G3-4, G2-3 (masquées)
- ❌ Séances G5-6, G6-7, G7+ (trop difficiles)
- ✅ Résolution de problème (toujours visible)

**Toggle COCHÉ :**
- ✅ Séances G4-5
- ✅ Séances G3-4
- ✅ Séances G2-3
- ❌ Séances G5-6, G6-7, G7+ (trop difficiles)
- ✅ Résolution de problème (toujours visible)

### Exemple 2 : Cavalier sélectionne **G2-3**

**Toggle DÉCOCHÉ (par défaut) :**
- ✅ Séances G2-3 uniquement
- ❌ Tous les autres niveaux
- ✅ Résolution de problème (toujours visible)

**Toggle COCHÉ :**
- ✅ Séances G2-3 (pas de niveau inférieur)
- ❌ Tous les niveaux supérieurs
- ✅ Résolution de problème (toujours visible)

### Exemple 3 : Cavalier sélectionne **G7+**

**Toggle DÉCOCHÉ (par défaut) :**
- ✅ Séances G7+ uniquement
- ❌ Séances G6-7, G5-6, G4-5, G3-4, G2-3 (masquées)
- ✅ Résolution de problème (toujours visible)

**Toggle COCHÉ :**
- ✅ Séances G7+
- ✅ Séances G6-7
- ✅ Séances G5-6
- ✅ Séances G4-5
- ✅ Séances G3-4
- ✅ Séances G2-3
- ✅ Résolution de problème (toujours visible)

---

## ⚠️ EXCEPTION : CATÉGORIE "RÉSOLUTION DE PROBLÈME"

### Règle spéciale :
La catégorie **"Résolution de problème"** est **TOUJOURS VISIBLE**, quel que soit le filtre de niveau ET quel que soit l'état du toggle.

### Pourquoi ?
- Les problèmes de chevaux (tire sur la main, manque d'impulsion, raideur, etc.) ne sont **pas liés au niveau du cavalier**
- Un cavalier G2-3 peut avoir un cheval qui tire
- Un cavalier G7+ peut avoir un cheval qui manque d'impulsion
- Ces séances sont **universelles** et utiles à tous

### Structure des fichiers :
```
SCRIPTS CORRECTION PROBLEMES/
├── cheval_qui_tire_sur_la_main.txt
├── cheval_precipite.txt
├── manque_dimpulsion.txt
├── raideur_dun_cote.txt
├── reactivite_aux_aides_insuffisante.txt
├── cheval_en_desequilibre.txt
├── cheval_qui_creuse_le_dos.txt
├── tete_en_lair_nuque_raide.txt
├── cheval_qui_coupe_les_courbes.txt
└── cheval_qui_ne_pousse_pas_du_posterieur.txt
```

**PAS de sous-dossiers de niveau** = séances accessibles à tous

### Implémentation :
```javascript
// Pseudo-code
if (categorie === "Résolution de problème") {
  // Afficher TOUTES les séances de cette catégorie
  // Ignorer le filtre de niveau ET le toggle
  afficherToutesSéances();
} else {
  // Appliquer la logique de filtre avec toggle
  if (toggleNiveauxInférieurs === true) {
    afficherSéancesNiveauActuelEtInférieurs();
  } else {
    afficherSéancesNiveauActuelUniquement();
  }
}
```

---

## 📂 STRUCTURE DES DOSSIERS

Les séances sont organisées par discipline puis par niveau :

```
SCRIPTS_SEANCES/
├── SCRIPTS DRESSAGE/
│   ├── G2-3/
│   ├── G3-4/
│   ├── G4-5/
│   ├── G5-6/
│   ├── G6-7/
│   └── G7+/
│
├── SCRIPTS OBSTACLE/
│   ├── G2-3/
│   ├── G3-4/
│   ├── G4-5/
│   ├── G5-6/
│   ├── G6-7/
│   └── G7+/
│
├── SCRIPTS TAP/
│   ├── G2-3/
│   ├── G3-4/
│   ├── G4-5/
│   ├── G5-6/
│   └── G7+/
│
├── SCRIPTS BALADE/
│   ├── G2-3/
│   ├── G3-4/
│   ├── G4-5/
│   └── G5-6/
│
├── SCRIPTS TRAVAIL SPECIFIQUE/
│   ├── G3-4/
│   ├── G4-5/
│   └── G5-6/
│
├── SCRIPTS MISE EN SELLE/
│   ├── G2-3/
│   ├── G3-4/
│   └── G4-5/
│
└── SCRIPTS CORRECTION PROBLEMES/
    ├── cheval_qui_tire_sur_la_main.txt
    ├── cheval_precipite.txt
    ├── manque_dimpulsion.txt
    ├── raideur_dun_cote.txt
    ├── reactivite_aux_aides_insuffisante.txt
    ├── cheval_en_desequilibre.txt
    ├── cheval_qui_creuse_le_dos.txt
    ├── tete_en_lair_nuque_raide.txt
    ├── cheval_qui_coupe_les_courbes.txt
    └── cheval_qui_ne_pousse_pas_du_posterieur.txt
    (PAS de sous-dossiers - séances universelles)
```

---

## 🎯 TABLEAU DE CORRESPONDANCE DES NIVEAUX

### Toggle DÉCOCHÉ (par défaut) :
| Niveau sélectionné | Niveaux affichés | Résolution problème |
|-------------------|------------------|---------------------|
| G2-3 | G2-3 uniquement | ✅ Toujours visible |
| G3-4 | G3-4 uniquement | ✅ Toujours visible |
| G4-5 | G4-5 uniquement | ✅ Toujours visible |
| G5-6 | G5-6 uniquement | ✅ Toujours visible |
| G6-7 | G6-7 uniquement | ✅ Toujours visible |
| G7+ | G7+ uniquement | ✅ Toujours visible |

### Toggle COCHÉ :
| Niveau sélectionné | Niveaux affichés | Résolution problème |
|-------------------|------------------|---------------------|
| G2-3 | G2-3 | ✅ Toujours visible |
| G3-4 | G2-3, G3-4 | ✅ Toujours visible |
| G4-5 | G2-3, G3-4, G4-5 | ✅ Toujours visible |
| G5-6 | G2-3, G3-4, G4-5, G5-6 | ✅ Toujours visible |
| G6-7 | G2-3, G3-4, G4-5, G5-6, G6-7 | ✅ Toujours visible |
| G7+ | G2-3, G3-4, G4-5, G5-6, G6-7, G7+ | ✅ Toujours visible |

**Résolution de problème = TOUJOURS visible dans tous les cas**

---

## 💡 RECOMMANDATIONS UX

### Interface utilisateur :
1. **Filtre de niveau** : Dropdown avec les niveaux G2-3, G3-4, G4-5, G5-6, G6-7, G7+
2. **Catégorie "Résolution de problème"** : Toujours affichée en haut ou dans une section dédiée
3. **Indication visuelle** : Afficher le niveau de chaque séance (badge ou tag) pour que le cavalier sache si c'est son niveau ou un niveau inférieur

### Exemple d'affichage :
```
📍 RÉSOLUTION DE PROBLÈME (Toujours disponible)
  - Cheval qui tire sur la main [G3+]
  - Manque d'impulsion [G3+]
  - Cheval précipité [G3+]

📍 DRESSAGE
  - Transitions fluides [G4-5] ← Ton niveau
  - Impulsion au trot [G3-4] ← Niveau accessible
  - Cercles et précision [G2-3] ← Niveau accessible
```

---

## 📌 NOTES IMPORTANTES

- Les séances **G3+** dans "Résolution de problème" sont adaptables à tous niveaux à partir de G3
- Un cavalier G2-3 peut aussi consulter ces séances si besoin (d'où la règle "toujours visible")
- La logique de filtre doit être **inclusive** (afficher aussi les niveaux inférieurs)
- Ne jamais afficher les niveaux supérieurs au niveau du cavalier (sauf "Résolution de problème")
