const fs = require('fs');
const path = require('path');

// Dossiers source et destination
const rawDataDir = path.join(__dirname, '..', 'RawData');
const dataDir = path.join(__dirname, '..', 'data');

// Assurer que le dossier data existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Fonction pour normaliser un élément de données
function normalizeDataItem(item) {
  // Convertir différents formats de status
  let status = item.status || 'pending';
  if (status === 'verified' || status === 'validé' || status === 'validated') {
    status = 'validated';
  } else if (status === 'corrected' || status === 'corrigé') {
    status = 'corrected';
  } else {
    status = 'pending';
  }

  return {
    page: item.page || '',
    paragraph: item.paragraph || '',
    type: item.type || '',
    context: item.context || '',
    value: item.value || item.valeur || '',
    source: item.source || '',
    status: status,
    comment: item.comment || '',
    comments: item.comments || item.comment || '',
  };
}

// Fonction pour convertir un objet JavaScript en JSON valide
function convertJsToJson(content, filename = '') {
  const vm = require('vm');
  
  try {
    // Créer un contexte isolé avec les fonctions nécessaires
    const context = vm.createContext({
      console: console,
      Buffer: Buffer,
    });
    
    // Essayer d'évaluer directement le contenu comme JavaScript
    try {
      const result = vm.runInContext(`(${content})`, context, {
        filename: filename,
        timeout: 5000,
      });
      return result;
    } catch (evalError) {
      // Si l'évaluation directe échoue, essayer avec Function
      try {
        const func = new Function(`return ${content}`);
        return func();
      } catch (funcError) {
        throw evalError;
      }
    }
  } catch (error) {
    // Si tout échoue, essayer de corriger le format manuellement
    if (filename) {
      console.warn(`Parsing direct échoué pour ${filename}, tentative de correction...`);
    }
    
    // Convertir en JSON valide en utilisant une approche plus robuste
    try {
      // Utiliser une bibliothèque externe si disponible, sinon fallback sur correction manuelle
      let corrected = content.trim();
      
      // Échapper les chaînes existantes pour éviter les conflits
      corrected = corrected.replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
        return match.replace(/"/g, '\\u0022');
      });
      
      // Ajouter des guillemets aux clés non-quotées (mais pas celles déjà dans des chaînes)
      corrected = corrected.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
      
      // Restaurer les chaînes originales
      corrected = corrected.replace(/\\u0022/g, '"');
      
      // Gérer les valeurs non-quotées (mais pas les nombres, booléens, null, chaînes)
      corrected = corrected.replace(/:\s*([^",\[\]{}:]+?)(\s*[,}\]])/g, (match, value, suffix) => {
        value = value.trim();
        // Si c'est un nombre, booléen ou null, ne pas ajouter de guillemets
        if (/^-?\d+\.?\d*$/.test(value) || value === 'true' || value === 'false' || value === 'null' || value === '') {
          return `: ${value}${suffix}`;
        }
        // Si ça contient des caractères spéciaux, échapper
        const escaped = value.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        return `: "${escaped}"${suffix}`;
      });
      
      return JSON.parse(corrected);
    } catch (e) {
      console.error(`Impossible de parser ${filename || 'fichier'}:`, e.message);
      console.error(`Première ligne du contenu: ${content.substring(0, 200)}`);
      return null;
    }
  }
}

// Mapping des noms de fichiers vers les informations de chapitre
const chapterMapping = {
  'CHAPITRE I - FONDEMENTS THÉORIQUES ET CONTEXTUALISATION STRATÉGIQUE.json': {
    chapter: 'CHAPITRE I',
    title: 'FONDEMENTS THÉORIQUES ET CONTEXTUALISATION STRATÉGIQUE',
  },
  'CHAPITRE II - CADRE MÉTHODOLOGIQUE.json': {
    chapter: 'CHAPITRE II',
    title: 'CADRE MÉTHODOLOGIQUE',
  },
  'CHAPITRE III - REVUE SYSTÉMATIQUE.json': {
    chapter: 'CHAPITRE III',
    title: 'REVUE SYSTÉMATIQUE',
  },
  'CHAPITRE IV - ARCHITECTURE SYSTÈME.json': {
    chapter: 'CHAPITRE IV',
    title: 'ARCHITECTURE SYSTÈME',
  },
  'CHAPITRE V - IMPLÉMENTATION ET VALIDATION.json': {
    chapter: 'CHAPITRE V',
    title: 'IMPLÉMENTATION ET VALIDATION',
  },
  'CHAPITRE VI - IMPLICATIONS STRATÉGIQUES ET RECOMMANDATIONS.json': {
    chapter: 'CHAPITRE VI',
    title: 'IMPLICATIONS STRATÉGIQUES ET RECOMMANDATIONS',
  },
  'CHAPITRE VII - SYNTHÈSE DES CONTRIBUTIONS.json': {
    chapter: 'CHAPITRE VII',
    title: 'SYNTHÈSE DES CONTRIBUTIONS',
  },
  'CONCLUSION GÉNÉRALE.json': {
    chapter: 'CONCLUSION GÉNÉRALE',
    title: 'CONCLUSIONS ET PERSPECTIVES',
  },
  'ANNEXES.json': {
    chapter: 'ANNEXES',
    title: 'DOCUMENTS ANNEXES (A à M)',
  },
};

// Fonction pour lire et normaliser un fichier JSON
function loadChapterFile(filename) {
  const filePath = path.join(rawDataDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Fichier non trouvé: ${filename}`);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Essayer d'abord de parser comme JSON valide
    let data;
    try {
      data = JSON.parse(content);
    } catch (e) {
      // Si ce n'est pas du JSON valide, utiliser la conversion JavaScript
      data = convertJsToJson(content, filename);
      if (!data) {
        throw new Error(`Impossible de parser le fichier ${filename}`);
      }
    }

    // Gérer le cas où le fichier est un tableau direct (comme ANNEXES.json)
    if (Array.isArray(data)) {
      const mapping = chapterMapping[filename];
      if (mapping) {
        return {
          chapter: mapping.chapter,
          title: mapping.title,
          data: data.map(normalizeDataItem),
        };
      }
      // Fallback si pas de mapping
      const chapterName = filename.replace('.json', '');
      return {
        chapter: chapterName,
        title: chapterName,
        data: data.map(normalizeDataItem),
      };
    }

    // Normaliser les données et s'assurer que chapter et title sont corrects
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(normalizeDataItem);
    }

    // Mettre à jour chapter et title si un mapping existe
    const mapping = chapterMapping[filename];
    if (mapping) {
      data.chapter = mapping.chapter;
      data.title = mapping.title;
    }

    return data;
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filename}:`, error.message);
    return null;
  }
}

// Données du chapitre 0 fournies par l'utilisateur
const chapter0Data = {
  chapter: "CHAPITRE 0",
  title: "PAGES LIMINAIRES & INTRODUCTION GÉNÉRALE",
  data: [
    {
      page: 1,
      paragraph: 2,
      type: "Donnée",
      context: "Économie informelle",
      value: "70% du PIB camerounais",
      source: "BUCREP, 2021",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 1,
      paragraph: 2,
      type: "Donnée",
      context: "Emploi informel",
      value: "80% de la population active",
      source: "BUCREP, 2021",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 1,
      paragraph: 4,
      type: "Donnée",
      context: "Pertes annuelles",
      value: "720 milliards FCFA",
      source: "Estimation DGI - Rapport 2024",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 2,
      paragraph: 1,
      type: "Donnée",
      context: "Serveurs obsolètes",
      value: "87% Oracle 11g (2009)",
      source: "Audit technique DGI 2024",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 2,
      paragraph: 1,
      type: "Donnée",
      context: "Capacité traitement",
      value: "15 000 transactions/jour",
      source: "Audit technique DGI 2024",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 2,
      paragraph: 2,
      type: "Donnée",
      context: "Bases de données",
      value: "147 bases disparates",
      source: "Audit infrastructure DGI",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 2,
      paragraph: 2,
      type: "Donnée",
      context: "Volume données",
      value: "47,3 téraoctets",
      source: "Audit infrastructure DGI",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 2,
      paragraph: 3,
      type: "Donnée",
      context: "Taux détection fraude",
      value: "12%",
      source: "Statistiques officielles DGI",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 2,
      paragraph: 4,
      type: "Donnée",
      context: "Taux conformité",
      value: "34%",
      source: "Audit conformité DGI 2024",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 2,
      paragraph: 5,
      type: "Donnée",
      context: "Interopérabilité",
      value: "23% systèmes connectés",
      source: "Analyse flux informationnels DGI",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: "Tableau 2",
      type: "Donnée",
      context: "Obsolescence technologique",
      value: "13% serveurs modernes vs 80% requis",
      source: "Tableau diagnostic ch.0",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: "Tableau 2",
      type: "Donnée",
      context: "Fragmentation données",
      value: "15% intégration vs 85% requis",
      source: "Tableau diagnostic ch.0",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: "Tableau 2",
      type: "Donnée",
      context: "Détection fraudes",
      value: "12% vs 75% cible",
      source: "Tableau diagnostic ch.0",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: "Tableau 2",
      type: "Donnée",
      context: "Conformité fiscale",
      value: "34% vs 80% cible",
      source: "Tableau diagnostic ch.0",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: "Tableau 2",
      type: "Donnée",
      context: "Impact économique total",
      value: "1 388 milliards FCFA",
      source: "Synthèse diagnostic ch.0",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: 4,
      type: "Question",
      context: "Question recherche principale",
      value: "Concevoir un système intelligent intégrant Big Data, ML, IA et Blockchain adapté au contexte camerounais",
      source: "Problématique recherche p.3",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: 5,
      type: "Question",
      context: "SQ1 - Fondements méthodologiques",
      value: "Adapter la DSRM au contexte des systèmes fiscaux africains",
      source: "Sous-questions recherche p.3",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: 5,
      type: "Question",
      context: "SQ2 - Intégration technologies",
      value: "Intégrer Big Data, ML, IA, Blockchain dans une architecture scalable",
      source: "Sous-questions recherche p.3",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: 5,
      type: "Question",
      context: "SQ3 - Algorithmes explicables",
      value: "ML explicable pour transparence et équité des décisions",
      source: "Sous-questions recherche p.3",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: 5,
      type: "Question",
      context: "SQ4 - Mesure impact",
      value: "Mesurer l'impact sur performance opérationnelle et équité fiscale",
      source: "Sous-questions recherche p.3",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: 5,
      type: "Question",
      context: "SQ5 - Conditions durabilité",
      value: "Conditions organisationnelles, techniques et éthiques pour durabilité",
      source: "Sous-questions recherche p.3",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 3,
      paragraph: 7,
      type: "Objectif",
      context: "Objectif général",
      value: "Optimiser la gestion fiscale par système intelligent intégrant Big Data, ML, IA, Blockchain",
      source: "Objectifs recherche p.3",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 4,
      paragraph: 1,
      type: "Objectif",
      context: "OS1 - Cadre méthodologique",
      value: "Adapter la DSRM aux spécificités camerounaises",
      source: "Objectifs spécifiques p.4",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 4,
      paragraph: 2,
      type: "Objectif",
      context: "OS2 - Architecture Big Data",
      value: ">50 000 transactions/jour, 99,9% disponibilité, <200ms latence",
      source: "Objectifs spécifiques p.4",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 4,
      paragraph: 3,
      type: "Objectif",
      context: "OS3 - Algorithmes ML",
      value: ">95% précision détection fraudes, <5% faux positifs",
      source: "Objectifs spécifiques p.4",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 4,
      paragraph: 4,
      type: "Objectif",
      context: "OS4 - Validation empirique",
      value: "Déploiement pilote dans 3 centres (Yaoundé, Douala, Garoua)",
      source: "Objectifs spécifiques p.4",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 4,
      paragraph: 5,
      type: "Objectif",
      context: "OS5 - Gouvernance éthique",
      value: "Framework de gouvernance pour extension CEMAC/UEMOA",
      source: "Objectifs spécifiques p.4",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 4,
      paragraph: 7,
      type: "Hypothèse",
      context: "H1 - Acceptabilité méthodologique",
      value: "Taux acceptation utilisateur >85%, adéquation fonctionnelle >90%",
      source: "Hypothèses p.4",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 4,
      paragraph: 8,
      type: "Hypothèse",
      context: "H2 - Performance technologique",
      value: "Amélioration performance >300%, disponibilité >99,9%, coûts -40%",
      source: "Hypothèses p.4",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 5,
      paragraph: 1,
      type: "Hypothèse",
      context: "H3 - Qualité algorithmique",
      value: "Précision >95%, rappel >90%, F1-score >92%, réduction biais >80%",
      source: "Hypothèses p.5",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 5,
      paragraph: 2,
      type: "Hypothèse",
      context: "H4 - Impact organisationnel",
      value: "Productivité +35%, réduction délais >50%, conformité >25%",
      source: "Hypothèses p.5",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 5,
      paragraph: 3,
      type: "Hypothèse",
      context: "H5 - Durabilité",
      value: "Conformité réglementaire >98%, auditabilité >95%, transférabilité >80%",
      source: "Hypothèses p.5",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 5,
      paragraph: 4,
      type: "Hypothèse",
      context: "H6 - Transparence Blockchain",
      value: "Satisfaction contribuables >80%, traçabilité >90%, litiges -30%",
      source: "Hypothèses p.5",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 10,
      paragraph: 4,
      type: "Résultat",
      context: "Performance validation",
      value: "Précision: 97,2%, Rappel: 94,8%",
      source: "Résumé thèse p.10",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 10,
      paragraph: 4,
      type: "Résultat",
      context: "Amélioration détection fraude",
      value: "Augmentation de 35% du taux de détection",
      source: "Résumé thèse p.10",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 10,
      paragraph: 4,
      type: "Résultat",
      context: "Réduction délais",
      value: "Réduction de 67% des délais de traitement",
      source: "Résumé thèse p.10",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 10,
      paragraph: 4,
      type: "Résultat",
      context: "Gain économique",
      value: "12,5 milliards FCFA annuellement",
      source: "Résumé thèse p.10",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 10,
      paragraph: 4,
      type: "Résultat",
      context: "Validation empirique",
      value: "3 centres fiscaux (Yaoundé, Douala, Garoua)",
      source: "Résumé thèse p.10",
      status: "pending",
      comment: "",
      comments: "",
    },
    {
      page: 10,
      paragraph: 4,
      type: "Perspective",
      context: "Extension régionale",
      value: "Extension à l'échelle CEMAC et UEMOA",
      source: "Résumé thèse p.10",
      status: "pending",
      comment: "",
      comments: "",
    },
  ],
};

// Liste des fichiers à charger (dans l'ordre)
const chapterFiles = [
  'CHAPITRE I - FONDEMENTS THÉORIQUES ET CONTEXTUALISATION STRATÉGIQUE.json',
  'CHAPITRE II - CADRE MÉTHODOLOGIQUE.json',
  'CHAPITRE III - REVUE SYSTÉMATIQUE.json',
  'CHAPITRE IV - ARCHITECTURE SYSTÈME.json',
  'CHAPITRE V - IMPLÉMENTATION ET VALIDATION.json',
  'CHAPITRE VI - IMPLICATIONS STRATÉGIQUES ET RECOMMANDATIONS.json',
  'CHAPITRE VII - SYNTHÈSE DES CONTRIBUTIONS.json',
  'CONCLUSION GÉNÉRALE.json',
  'ANNEXES.json',
];

// Charger tous les chapitres
const allChapters = [chapter0Data];

chapterFiles.forEach((filename) => {
  const chapter = loadChapterFile(filename);
  if (chapter) {
    allChapters.push(chapter);
    console.log(`✓ Chargé: ${filename}`);
  }
});

// Créer le fichier JSON consolidé
const outputFile = path.join(dataDir, 'thesis-data.json');
fs.writeFileSync(
  outputFile,
  JSON.stringify(allChapters, null, 2),
  'utf-8'
);

console.log(`\n✓ Données consolidées sauvegardées dans: ${outputFile}`);
console.log(`✓ Total de ${allChapters.length} chapitres chargés`);

// Afficher le résumé
allChapters.forEach((chapter) => {
  console.log(`  - ${chapter.chapter}: ${chapter.data?.length || 0} éléments`);
});

