"use client"

import type React from "react"
import { useState, useMemo, useEffect, useRef } from "react"
import { Download, RotateCcw, CheckCircle2, AlertCircle, Pencil as Pencil2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditableCell } from "@/components/editable-cell"

interface DataItem {
  id?: number
  page: number | string
  paragraph: number | string
  type: string
  context: string
  value: string
  source: string
  status: "pending" | "validated" | "corrected" | "validé" | "en attente"
  comment: string
  comments: string
  liens?: string
}

interface ChapterData {
  chapter: string
  title: string
  data: DataItem[]
}

// Keep THESIS_DATA as fallback, but we'll load from API
const THESIS_DATA: ChapterData[] = [
  {
    chapter: "CHAPITRE 0",
    title: "PAGES LIMINAIRES & INTRODUCTION GÉNÉRALE",
    data: [
      {
        page: 1,
        paragraph: 2,
        type: "Donnée",
        context: "Économie informelle",
        value: "70% du PIB camerounais",
        source: "DGI - Rapport annuel 2024",
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
        source: "INS Cameroun - Enquête emploi 2023",
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
        source: "Ministère des Finances - Budget 2024",
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
        source: "SIGTAS - Logs système 2024",
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
        source: "DGI - Rapports de stockage",
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
        source: "Systèmes actuels DGI",
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
        source: "Inventaire systèmes DGI",
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
        page: 4,
        paragraph: 3,
        type: "Objectif",
        context: "OS2 - Architecture Big Data",
        value: ">50 000 transactions/jour, 99,9% disponibilité, <200ms latence",
        source: "Objectifs thèse p.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 4,
        paragraph: 4,
        type: "Objectif",
        context: "OS3 - Algorithmes ML",
        value: ">95% précision détection fraudes",
        source: "Objectifs thèse p.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 4,
        paragraph: 7,
        type: "Hypothèse",
        context: "H1 - Acceptabilité",
        value: "Taux acceptation >85%, temps réponse <200ms",
        source: "Hypothèses p.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 5,
        paragraph: 2,
        type: "Hypothèse",
        context: "H2 - Performance",
        value: "Amélioration performance >300%",
        source: "Hypothèses p.5",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 5,
        paragraph: 3,
        type: "Hypothèse",
        context: "H3 - Qualité ML",
        value: "Précision >95%, rappel >90%, F1-score >92%",
        source: "Hypothèses p.5",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 5,
        paragraph: 4,
        type: "Hypothèse",
        context: "H4 - Impact organisationnel",
        value: "Productivité +35%, délais -50%, conformité +25%",
        source: "Hypothèses p.5",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 5,
        paragraph: 5,
        type: "Hypothèse",
        context: "H5 - Conformité",
        value: "Conformité réglementaire >98%",
        source: "Hypothèses p.5",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 5,
        paragraph: 6,
        type: "Hypothèse",
        context: "H6 - Satisfaction",
        value: "Satisfaction contribuables >80%, traçabilité >90%",
        source: "Hypothèses p.5",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "CHAPITRE I",
    title: "FONDEMENTS THÉORIQUES",
    data: [
      {
        page: 8,
        paragraph: 2,
        type: "Référence",
        context: "Rawls - Justice",
        value: '"Theory of Justice" (1971)',
        source: "Rawls, J. (1971). Theory of Justice",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 8,
        paragraph: 3,
        type: "Référence",
        context: "Rousseau - Légitimité",
        value: '"Contrat Social" (1762)',
        source: "Rousseau, J-J. (1762). Du Contrat Social",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 8,
        paragraph: 4,
        type: "Référence",
        context: "Locke - Propriété",
        value: '"Two Treatises of Government" (1689)',
        source: "Locke, J. (1689). Two Treatises",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 8,
        paragraph: 5,
        type: "Référence",
        context: "Piketty - Inégalités",
        value: '"Capital in the Twenty-First Century" (2013)',
        source: "Piketty, T. (2013). Capital au XXIe siècle",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 9,
        paragraph: 1,
        type: "Référence",
        context: "Besley & Persson",
        value: "État et fiscalité (2011)",
        source: "Besley, T. & Persson, T. (2011)",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 9,
        paragraph: 2,
        type: "Référence",
        context: "Bräutigam et al.",
        value: "Fiscalité africaine (2008)",
        source: "Bräutigam, D. et al. (2008)",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 9,
        paragraph: 3,
        type: "Donnée",
        context: "Structure recettes TVA",
        value: "45% des recettes totales",
        source: "DGI - Statistiques fiscales 2023",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 10,
        paragraph: 1,
        type: "Donnée",
        context: "Recettes fiscales 2015",
        value: "2 847 milliards FCFA",
        source: "Loi de Finances 2015",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 10,
        paragraph: 1,
        type: "Donnée",
        context: "Recettes fiscales 2024",
        value: "4 236 milliards FCFA",
        source: "Loi de Finances 2024",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 10,
        paragraph: 1,
        type: "Donnée",
        context: "Ratio recettes/PIB",
        value: "14,8% (2015) → 16,2% (2024)",
        source: "BEAC - Comptes nationaux",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 10,
        paragraph: 1,
        type: "Donnée",
        context: "Standard international",
        value: "20% pour pays en développement",
        source: "FMI - Fiscal Handbook",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 10,
        paragraph: 2,
        type: "Donnée",
        context: "Création Direction Générale des Impôts",
        value: "1999",
        source: "Décret présidentiel Cameroun",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 10,
        paragraph: 3,
        type: "Information",
        context: "Phases de réforme DGI",
        value: "1999-2005: structuration, 2006-2015: informatisation, 2016-2025: transformation numérique",
        source: "Rapport DGI - Historique réformes",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 11,
        paragraph: 1,
        type: "Donnée",
        context: "Structure organisationnelle DGI",
        value: "6 directions techniques, 10 régionales, 58 centres, 12 brigades",
        source: "Organigramme DGI 2024",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 11,
        paragraph: "Figure I.2.2",
        type: "Organigramme",
        context: "Structure organisationnelle DGI",
        value: "Schéma complet 6 directions + 10 régions",
        source: "Figure I.2.2 - Thèse",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 11,
        paragraph: 3,
        type: "Information",
        context: "Système d'information actuel",
        value: "SIGTAS (Système Intégré de Gestion des Taxes et Accises)",
        source: "Documentation DGI SIGTAS",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 11,
        paragraph: 4,
        type: "Information",
        context: "Audit technique réalisé",
        value: "Diagnostic complet des systèmes en 2024",
        source: "Audit DGI 2024",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 12,
        paragraph: 1,
        type: "Donnée",
        context: "Secteur informel Cameroun",
        value: "70% du PIB, 80% emploi",
        source: "INS Cameroun - Statistiques 2023",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 12,
        paragraph: 4,
        type: "Donnée",
        context: "Évasion fiscale annuelle",
        value: "425 milliards FCFA/an (10% recettes potentielles)",
        source: "Estimation DGI - Rapport 2024",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 12,
        paragraph: 5,
        type: "Donnée",
        context: "Fragmentation systèmes d'information",
        value: "147 bases de données, 47,3 TB non structurées",
        source: "Audit infrastructure DGI",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 13,
        paragraph: 1,
        type: "Donnée",
        context: "Capacité traitement actuelle",
        value: "15 000 transactions/jour vs 50 000 besoins",
        source: "Logs SIGTAS 2024",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 13,
        paragraph: 2,
        type: "Donnée",
        context: "Coût de maintenance annuel",
        value: "350 millions FCFA/an",
        source: "Budget fonctionnement DGI",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 13,
        paragraph: "Tableau I.3.4",
        type: "Diagnostic",
        context: "Secteur informel",
        value: "Coût: 425 Mds FCFA, Priorité: Très élevée",
        source: "Tableau diagnostic I.3.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 13,
        paragraph: "Tableau I.3.4",
        type: "Diagnostic",
        context: "Fragmentation SI",
        value: "Coût: 85 Mds FCFA, Priorité: Élevée",
        source: "Tableau diagnostic I.3.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 13,
        paragraph: "Tableau I.3.4",
        type: "Diagnostic",
        context: "Obsolescence technologique",
        value: "Coût: 350 Mds FCFA, Priorité: Très élevée",
        source: "Tableau diagnostic I.3.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 13,
        paragraph: "Tableau I.3.4",
        type: "Diagnostic",
        context: "Compétences digitales",
        value: "35% agents formés, Coût: 125 Mds FCFA, Priorité: Moyenne",
        source: "Tableau diagnostic I.3.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 13,
        paragraph: "Tableau I.3.4",
        type: "Diagnostic",
        context: "Interopérabilité systèmes",
        value: "23% connectés, Coût: 95 Mds FCFA, Priorité: Moyenne",
        source: "Tableau diagnostic I.3.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 14,
        paragraph: 1,
        type: "Information",
        context: "Technologies RegTech",
        value: "Applications prometteuses dans domaine fiscal",
        source: "Ch. I - Technologies émergentes",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 15,
        paragraph: 1,
        type: "Référence",
        context: "Benchmark international",
        value: "HMRC (UK), DGFiP (FR), ATO (AU)",
        source: "Etudes comparatives internationales",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 15,
        paragraph: 2,
        type: "Référence",
        context: "Benchmark africain",
        value: "RRA (Rwanda), SARS (Afrique Sud)",
        source: "Benchmarking africain",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 16,
        paragraph: 5,
        type: "Donnée",
        context: "Coût total des défis identifiés",
        value: "1 388 milliards FCFA",
        source: "Synthèse défis ch. I",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "CHAPITRE II",
    title: "CADRE MÉTHODOLOGIQUE",
    data: [
      {
        page: 18,
        paragraph: 1,
        type: "Référence",
        context: "Design Science Research Methodology",
        value: "Peffers et al. (2007)",
        source: "Peffers, K. et al. DSRM framework",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 18,
        paragraph: 1,
        type: "Référence",
        context: "DSR Foundations",
        value: "Hevner & Chatterjee (2010)",
        source: "Hevner, A. & Chatterjee, S.",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 18,
        paragraph: 3,
        type: "Référence",
        context: "Sciences de l'Artificiel",
        value: '"The Sciences of the Artificial" (1996)',
        source: "Simon, H. A. (1996)",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 18,
        paragraph: 4,
        type: "Information",
        context: "Générations de DSR",
        value: "3 générations: Simon (1), Hevner 2004 (2), En développement (3)",
        source: "Évolution DSR p.18",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 19,
        paragraph: 1,
        type: "Référence",
        context: "Technology Acceptance Model",
        value: "Venkatesh et al. UTAUT (2003)",
        source: "Venkatesh, V. et al. UTAUT",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 19,
        paragraph: 4,
        type: "Référence",
        context: "Critères d'innovation",
        value: "March & Smith (1995)",
        source: "March, S. T. & Smith, G. F.",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 19,
        paragraph: 8,
        type: "Critères",
        context: "Évaluation innovation",
        value: "Nouveauté, Utilité, Faisabilité, Élégance",
        source: "Critères évaluation p.19",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 20,
        paragraph: 1,
        type: "Donnée",
        context: "Contexte africain",
        value: "70% PIB informel, 80% emploi informel",
        source: "Contexte Cameroun p.20",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 20,
        paragraph: 1,
        type: "Information",
        context: "Spécificités contexte africain",
        value:
          "5 dimensions: économie informelle, diversité linguistique, contraintes infrastructurelles, faible culture numérique, défis gouvernance",
        source: "Spécificités africaines p.20",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 20,
        paragraph: 3,
        type: "Information",
        context: "Multilinguisme",
        value: "Français, anglais, langues locales (fon, douala, etc.)",
        source: "Contexte p.20",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 20,
        paragraph: 6,
        type: "Information",
        context: "Défis contextuels identifiés",
        value: "Confiance institutionnelle, compétences techniques, interopérabilité, infrastructure",
        source: "Défis p.20",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 21,
        paragraph: 1,
        type: "Principe",
        context: "Co-conception",
        value: "Implication des parties prenantes locales",
        source: "Principes p.21",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 21,
        paragraph: 2,
        type: "Principe",
        context: "Validation multi-niveaux",
        value: "Dimensions: techniques, socioculturelles, institutionnelles, éthiques",
        source: "Principes p.21",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 21,
        paragraph: 3,
        type: "Principe",
        context: "Adaptation technologique",
        value: "Solutions robustes et adaptables au contexte",
        source: "Principes p.21",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 21,
        paragraph: 4,
        type: "Innovation",
        context: "Validation contextuelle",
        value: "Innovation méthodologique majeure du projet",
        source: "Innovation p.21",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 21,
        paragraph: 6,
        type: "Métriques",
        context: "Validation",
        value: "Quantitatives (perf, efficacité, impact) + Qualitatives (acceptabilité, satisfaction)",
        source: "Métriques validation p.21",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 22,
        paragraph: "Figure II.3.1",
        type: "Schéma",
        context: "Cycle DSRM adapté",
        value: "6 phases avec itérations basées sur feedback",
        source: "Figure II.3.1",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 24,
        paragraph: "Figure II.4",
        type: "Framework",
        context: "Validation multidimensionnelle",
        value: "4 dimensions: Technique, Fonctionnelle, Organisationnelle, Stratégique",
        source: "Figure II.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 26,
        paragraph: 1,
        type: "Donnée",
        context: "Limitations des systèmes actuels",
        value: "15 000 transactions/jour vs 50 000 besoins",
        source: "Analyse besoins p.26",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 27,
        paragraph: 2,
        type: "Donnée",
        context: "Croissance données projetée",
        value: "35% par an",
        source: "Projections p.27",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 27,
        paragraph: 2,
        type: "Donnée",
        context: "Volume de données actuel",
        value: "47,3 téraoctets",
        source: "Audit données p.27",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 27,
        paragraph: 8,
        type: "Justification",
        context: "Avantages cloud computing",
        value: "Performance +300%, coûts -40% vs on-premise",
        source: "Justification cloud p.27",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 28,
        paragraph: 1,
        type: "Information",
        context: "Limitations actuelles DGI",
        value: "Architecture monolithique, sécurité obsolète, pas de scalabilité",
        source: "Analyse limitations p.28",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 29,
        paragraph: 1,
        type: "Donnée",
        context: "Performance actuelle système",
        value: "Temps réponse moyen: 3,2 secondes",
        source: "Mesures baseline p.29",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 29,
        paragraph: 5,
        type: "Donnée",
        context: "Avantages performance cloud",
        value: "Performance +300% vs systèmes traditionnels",
        source: "Comparaison p.29",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 31,
        paragraph: 2,
        type: "Spécification",
        context: "Infrastructure test AWS",
        value: "EC2 c5.4xlarge: 16 vCPU, 32GB RAM, 10 Gbps",
        source: "Spécifications infrastructure p.31",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 31,
        paragraph: 2,
        type: "Spécification",
        context: "Performance cible",
        value: "100 000 transactions/jour, latence <200ms",
        source: "Objectifs performance p.31",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 31,
        paragraph: 3,
        type: "Spécification",
        context: "Stockage AWS",
        value: "EBS gp3: 10 TB, 16 000 IOPS",
        source: "Spécifications stockage p.31",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 31,
        paragraph: 4,
        type: "Spécification",
        context: "Réseau",
        value: "1 Gbps avec redondance multi-région",
        source: "Spécifications réseau p.31",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 31,
        paragraph: 6,
        type: "Sécurité",
        context: "Chiffrement données",
        value: "AES-256 (repos), TLS 1.3 (transit)",
        source: "Politiques sécurité p.31",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 31,
        paragraph: 7,
        type: "Sécurité",
        context: "Authentification et accès",
        value: "MFA (Multi-Facteurs), RBAC (Contrôle d'accès basé rôles)",
        source: "Politiques IAM p.31",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 31,
        paragraph: 8,
        type: "Monitoring",
        context: "Outils de supervision",
        value: "AWS CloudWatch, ELK Stack (Elasticsearch, Logstash, Kibana)",
        source: "Stack monitoring p.31",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 32,
        paragraph: 1,
        type: "Métrique",
        context: "Performance technique",
        value: "50 000 transactions/jour, <200ms p95",
        source: "Métriques p.32",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 32,
        paragraph: 1,
        type: "Métrique",
        context: "Disponibilité du service",
        value: "99,90% uptime",
        source: "SLA p.32",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 32,
        paragraph: 1,
        type: "Métrique",
        context: "Précision algorithmes ML",
        value: ">95% pour détection fraudes",
        source: "Métriques ML p.32",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 32,
        paragraph: 4,
        type: "Détail",
        context: "Métriques performance",
        value: "Latence <200ms, débit 50k trans/jour, Apdex >0.95",
        source: "Détails métriques p.32",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 32,
        paragraph: 5,
        type: "Détail",
        context: "Fiabilité du système",
        value: "Disponibilité 99,9%, RTO 4h, RPO 1h, MTTR <30min",
        source: "SLA détaillés p.32",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 32,
        paragraph: 6,
        type: "Détail",
        context: "Qualité technique",
        value: "Précision 95%, complétude données 99%, cohérence >99%",
        source: "Garanties qualité p.32",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 33,
        paragraph: 2,
        type: "Métrique",
        context: "Transformation organisationnelle",
        value: "Productivité agents +35%, délais traitement -50%",
        source: "Impacts p.33",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 33,
        paragraph: 3,
        type: "Métrique",
        context: "Impact socio-économique",
        value: "Équité fiscale, inclusion sociale, développement économique",
        source: "Impacts ODD p.33",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 35,
        paragraph: 4,
        type: "Normes",
        context: "Protection des données",
        value: "RGPD, ISO 27001 adaptés contexte camerounais",
        source: "Normes p.35",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 35,
        paragraph: 10,
        type: "Normes",
        context: "Standards techniques",
        value: "ISO, IEEE, W3C, REST API standards",
        source: "Normes p.35",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "CHAPITRE III",
    title: "REVUE SYSTÉMATIQUE",
    data: [
      {
        page: 43,
        paragraph: 1,
        type: "Donnée",
        context: "Corpus final articles",
        value: "342 articles sélectionnés",
        source: "Revue systématique p.43",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 43,
        paragraph: 1,
        type: "Donnée",
        context: "Répartition thématique",
        value: "Big Data 38%, ML 29%, IA 21%, Blockchain 12%",
        source: "Analyse corpus p.43",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 43,
        paragraph: 1,
        type: "Donnée",
        context: "Répartition géographique",
        value: "Pays développés 67%, en développement 33%, Afrique 8%",
        source: "Distribution géographique p.43",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 43,
        paragraph: 4,
        type: "Donnée",
        context: "Croissance publications",
        value: "23 articles (2015) → 187 (2023), +28,5% annuel",
        source: "Évolution temporelle p.43",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 1,
        type: "Donnée",
        context: "Taux de rétention",
        value: "12% (342/2847 articles)",
        source: "Sélection articles p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 2,
        type: "Donnée",
        context: "Publications Big Data",
        value: "38% du corpus",
        source: "Distribution thématique p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 2,
        type: "Donnée",
        context: "Publications Machine Learning",
        value: "29% du corpus",
        source: "Distribution thématique p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 2,
        type: "Donnée",
        context: "Publications Intelligence Artificielle",
        value: "21% du corpus",
        source: "Distribution thématique p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 2,
        type: "Donnée",
        context: "Publications Blockchain",
        value: "12% du corpus",
        source: "Distribution thématique p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 3,
        type: "Donnée",
        context: "Concentration géographique",
        value: "USA 23%, UE 31%, Asie 13%",
        source: "Distribution géographique p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 4,
        type: "Donnée",
        context: "Score qualité moyen",
        value: "19,2/25",
        source: "Évaluation qualité p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 4,
        type: "Donnée",
        context: "Publications en Q1",
        value: "78%",
        source: "Calibre revues p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 44,
        paragraph: 4,
        type: "Donnée",
        context: "Conférences internationales",
        value: "22%",
        source: "Sources publications p.44",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 45,
        paragraph: 2,
        type: "Donnée",
        context: "Croissance 2020-2024",
        value: "8 publications (2020) → 47 (2024), +487%",
        source: "Analyse tendances p.45",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 45,
        paragraph: 3,
        type: "Donnée",
        context: "Processus screening",
        value: "847 articles évalués, 2000 exclus",
        source: "Phase screening p.45",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 45,
        paragraph: 4,
        type: "Donnée",
        context: "Phase éligibilité",
        value: "234 articles évalués, 613 exclus, 169 retenus",
        source: "Phase éligibilité p.45",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 47,
        paragraph: 1,
        type: "Donnée",
        context: "Corpus final haute qualité",
        value: "169 articles retenus",
        source: "Résultat final p.47",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 47,
        paragraph: 3,
        type: "Donnée",
        context: "Distribution géographique",
        value: "USA 23%, UE 31%, Asie développée 13%, Amérique Latine 12%, Asie développement 13%, Afrique 8%",
        source: "Cartographie p.47",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 48,
        paragraph: 2,
        type: "Analyse",
        context: "Défis pays en développement",
        value:
          "5 défis: limitations infrastructurelles, contraintes budgétaires, économie informelle, faible culture numérique, défis gouvernance",
        source: "Analyse défis p.48",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 48,
        paragraph: 3,
        type: "Analyse",
        context: "Applications prometteuses",
        value:
          "5 domaines: détection fraudes, optimisation collecte, amélioration conformité, réduction coûts, augmentation transparence",
        source: "Taxonomie applications p.48",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 50,
        paragraph: 1,
        type: "Lacunes",
        context: "Lacunes identifiées",
        value: "5 gaps: contextuelle, méthodologique, technologique, évaluative, empirique",
        source: "Synthèse lacunes p.50",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 52,
        paragraph: 1,
        type: "Études",
        context: "Cas comparatifs",
        value:
          "12 pays: Estonie, Inde, Rwanda, Kenya, Brésil, Singapour, Ghana, Corée, Colombie, Maroc, Afrique Sud, Chili",
        source: "Analyse 12 pays p.52",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 54,
        paragraph: 3,
        type: "Leçons",
        context: "Leçons apprises",
        value: "4 enseignements: stratégique, contextuelle, méthodologique, technologique, organisationnelle",
        source: "Synthèse leçons p.54",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 54,
        paragraph: 4,
        type: "Technologie",
        context: "Technologies futures",
        value: "IA générative, quantum computing, edge computing, digital twins, IoT",
        source: "Évolutions technologiques p.54",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "CHAPITRE IV",
    title: "ARCHITECTURE SYSTÈME",
    data: [
      {
        page: 59,
        paragraph: 1,
        type: "Donnée",
        context: "Croissance volume données",
        value: "200% sur 5 ans (47,3 TB → 142 TB)",
        source: "Projections p.59",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 59,
        paragraph: 1,
        type: "Donnée",
        context: "Performance transactions",
        value: "50 000 transactions/jour, latence <500ms",
        source: "Objectifs performance p.59",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 59,
        paragraph: 2,
        type: "Donnée",
        context: "Fiabilité",
        value: "Disponibilité 99,5%, RTO 4h, RPO 1h",
        source: "SLA p.59",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 60,
        paragraph: "Figure IV.1.2",
        type: "Architecture",
        context: "Architecture Lambda hybride",
        value: "3 couches: batch, speed, serving",
        source: "Figure IV.1.2",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 61,
        paragraph: 1,
        type: "Donnée",
        context: "Sources d'ingestion",
        value: "5 sources: SIGTAS, Oracle 11g, API REST, Banques, Douanes",
        source: "Sources données p.61",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 61,
        paragraph: 2,
        type: "Technologie",
        context: "Couche batch",
        value: "Apache Spark, Hadoop",
        source: "Stack batch p.61",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 61,
        paragraph: 3,
        type: "Technologie",
        context: "Couche speed",
        value: "Apache Kafka (streaming), Apache Storm (traitement temps réel)",
        source: "Stack streaming p.61",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 61,
        paragraph: 4,
        type: "Technologie",
        context: "Couche serving",
        value: "Cassandra (NoSQL), Redis (cache)",
        source: "Stack serving p.61",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 62,
        paragraph: 2,
        type: "Donnée",
        context: "Performance ingestion",
        value: "10 000 transactions/seconde, <100ms latence",
        source: "Specs ingestion p.62",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 63,
        paragraph: 1,
        type: "Pipeline",
        context: "Détection fraude",
        value: "4 couches: ingestion, prétraitement, analyse, scoring",
        source: "Architecture ML p.63",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 63,
        paragraph: 2,
        type: "Technologie",
        context: "Explicabilité ML",
        value: "SHAP (SHapley Additive exPlanations), LIME (Local Interpretable Model-agnostic Explanations)",
        source: "Outils explicabilité p.63",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 64,
        paragraph: 2,
        type: "Technologie",
        context: "Blockchain",
        value: "Blockchain permissionnée pour registre décisions immuable",
        source: "Blockchain specs p.64",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 65,
        paragraph: "Figure IV.3",
        type: "Donnée",
        context: "Variables Pipeline détection",
        value: "127 variables → 45 variables optimisées",
        source: "Feature engineering p.65",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 65,
        paragraph: "Figure IV.3",
        type: "Performance",
        context: "Modélisation",
        value: "Précision 87,3%, F1-score 0,84",
        source: "Résultats modèle p.65",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 65,
        paragraph: "Figure IV.3",
        type: "Donnée",
        context: "Explicabilité",
        value: "62 cas expliqués/jour",
        source: "Explicabilité p.65",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 66,
        paragraph: 1,
        type: "Donnée",
        context: "Données brutes",
        value: "127 variables",
        source: "Données initiales p.66",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 66,
        paragraph: 2,
        type: "Donnée",
        context: "Feature engineering",
        value: "127 → 45 variables optimisées via sélection statistique",
        source: "Feature selection p.66",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 66,
        paragraph: 3,
        type: "Algorithmes",
        context: "Modèles ML",
        value: "XGBoost, Random Forest, SVM (ensemble learning)",
        source: "Algorithmes p.66",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 66,
        paragraph: 4,
        type: "Technologie",
        context: "Agrégation temporelle",
        value: "Fenêtres glissantes 3, 6, 12 mois",
        source: "Techniques p.66",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 70,
        paragraph: "Figure IV.5",
        type: "Interface",
        context: "Explicabilité SHAP",
        value: "Visualisations interactives des facteurs de risque",
        source: "Interface p.70",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "CHAPITRE V",
    title: "IMPLÉMENTATION ET VALIDATION",
    data: [
      {
        page: 90,
        paragraph: 1,
        type: "Donnée",
        context: "Centres pilotes",
        value: "Yaoundé, Douala, Garoua",
        source: "Sites pilotes p.90",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 95,
        paragraph: 2,
        type: "Résultat",
        context: "Performance technique",
        value: "Précision: 97,2%, Rappel: 94,8%",
        source: "Résultats validation p.95",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 96,
        paragraph: 3,
        type: "Donnée",
        context: "Segmentation contribuables",
        value: "5 profils types identifiés",
        source: "Profils p.96",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 96,
        paragraph: 4,
        type: "Donnée",
        context: "Acceptation TAM",
        value: "Score moyen 4,2/5",
        source: "TAM p.96",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 97,
        paragraph: 1,
        type: "Donnée",
        context: "Phases déploiement",
        value: "3 phases sur 12 mois",
        source: "Planification p.97",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 98,
        paragraph: 2,
        type: "Donnée",
        context: "Agents formés",
        value: "350 agents sur 3 centres",
        source: "Formation p.98",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 99,
        paragraph: 3,
        type: "Donnée",
        context: "Taux d'utilisation",
        value: "89% après 6 mois",
        source: "Adoption p.99",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 102,
        paragraph: 2,
        type: "Donnée",
        context: "Satisfaction utilisateurs",
        value: "Score: 4,5/5",
        source: "Satisfaction p.102",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 104,
        paragraph: 1,
        type: "Donnée",
        context: "Efficacité opérationnelle",
        value: "Productivité +35%",
        source: "Impacts p.104",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 105,
        paragraph: 2,
        type: "Donnée",
        context: "Gain de temps traitement",
        value: "Réduction de 67%",
        source: "Temps p.105",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 109,
        paragraph: "Tableau V.8.1",
        type: "Donnée",
        context: "Coût-bénéfice",
        value: "Gain annuel: 12,5 milliards FCFA",
        source: "Analyse économique p.109",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 112,
        paragraph: "Figure V.8.2c",
        type: "Donnée",
        context: "ROI sur 5 ans",
        value: "ROI = 287%",
        source: "Projection financière p.112",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 113,
        paragraph: 3,
        type: "Donnée",
        context: "Projection financière",
        value: "Gain cumulé: 62,5 milliards FCFA",
        source: "5-year projection p.113",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 124,
        paragraph: 1,
        type: "Donnée",
        context: "Impact recettes",
        value: "Augmentation: 18%",
        source: "Impact économique p.124",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 125,
        paragraph: 2,
        type: "Donnée",
        context: "Impact économie informelle",
        value: "Réduction: 15%",
        source: "Formalisation p.125",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 126,
        paragraph: 3,
        type: "Donnée",
        context: "Impact sociétal",
        value: "Confiance: +40%",
        source: "Impacts sociaux p.126",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "CHAPITRE VI",
    title: "IMPLICATIONS STRATÉGIQUES",
    data: [
      {
        page: 129,
        paragraph: 1,
        type: "Donnée",
        context: "Architecture actuelle",
        value: "87% serveurs Oracle 11g (obsolètes)",
        source: "État des lieux p.129",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 130,
        paragraph: 2,
        type: "Donnée",
        context: "Interopérabilité",
        value: "23% systèmes connectés avec autres administrations",
        source: "Diagnostic p.130",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 131,
        paragraph: 3,
        type: "Donnée",
        context: "Budget modernisation",
        value: "245 milliards FCFA estimés",
        source: "Investissements p.131",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 131,
        paragraph: 4,
        type: "Donnée",
        context: "Roadmap transformation",
        value: "5 ans, 4 phases",
        source: "Planning p.131",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 137,
        paragraph: 2,
        type: "Donnée",
        context: "Formation agents",
        value: "500 agents/an",
        source: "RH p.137",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 137,
        paragraph: 3,
        type: "Donnée",
        context: "Migration cloud",
        value: "Cloud hybride (60% public, 40% privé)",
        source: "Infrastructure p.137",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 138,
        paragraph: 1,
        type: "Donnée",
        context: "Coopération régionale CEMAC",
        value: "Harmonisation fiscale 6 pays",
        source: "Région p.138",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 139,
        paragraph: 2,
        type: "Donnée",
        context: "Coopération UEMOA",
        value: "Partage données transfrontalières",
        source: "Région p.139",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 140,
        paragraph: 3,
        type: "Donnée",
        context: "Harmonisation pratiques",
        value: "Standard commun d'ici 2027",
        source: "Calendrier p.140",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 142,
        paragraph: 1,
        type: "Donnée",
        context: "Risques identifiés",
        value: "15 risques majeurs",
        source: "Analyse risques p.142",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 144,
        paragraph: 4,
        type: "Donnée",
        context: "Plan continuité",
        value: "PCA avec RTO < 6h",
        source: "Business continuity p.144",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 146,
        paragraph: 4,
        type: "Donnée",
        context: "Coût non-interopérabilité",
        value: "95 milliards FCFA/an",
        source: "Impact économique p.146",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 147,
        paragraph: 1,
        type: "Donnée",
        context: "Systèmes legacy à migrer",
        value: "8 systèmes",
        source: "Migration p.147",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 147,
        paragraph: 2,
        type: "Donnée",
        context: "Résistance au changement",
        value: "40% initialement",
        source: "Change management p.147",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 152,
        paragraph: 1,
        type: "Donnée",
        context: "Potentiel blockchain",
        value: "Réduction litiges: 30%",
        source: "Blockchain p.152",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 157,
        paragraph: 2,
        type: "Donnée",
        context: "Résultat intégration",
        value: "Réussite technique: 94%",
        source: "Pilots p.157",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 162,
        paragraph: 1,
        type: "Donnée",
        context: "Feuille de route",
        value: "4 phases sur 36 mois",
        source: "Roadmap p.162",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 163,
        paragraph: 3,
        type: "Donnée",
        context: "Budget total",
        value: "387 milliards FCFA sur 5 ans",
        source: "Investissements p.163",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "CHAPITRE VII",
    title: "SYNTHÈSE DES CONTRIBUTIONS",
    data: [
      {
        page: 167,
        paragraph: 1,
        type: "Information",
        context: "Synthèse contributions",
        value: "Contributions multidimensionnelles validées",
        source: "Ch.VII intro",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 168,
        paragraph: "Figure VII.0",
        type: "Donnée",
        context: "Dimensions contributions",
        value: "4 dimensions: théorique, méthodologique, technologique, empirique",
        source: "Figure VII.0",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 169,
        paragraph: 1,
        type: "Donnée",
        context: "Contribution théorique",
        value: "Adaptation DSRM au contexte africain",
        source: "Théorie p.169",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 169,
        paragraph: 2,
        type: "Donnée",
        context: "Contribution méthodologique",
        value: "Cadre d'évaluation multidimensionnel",
        source: "Méthodologie p.169",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 170,
        paragraph: 1,
        type: "Donnée",
        context: "Contribution technologique",
        value: "Architecture Lambda hybride optimisée pour contextes africains",
        source: "Technologie p.170",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 172,
        paragraph: 1,
        type: "Donnée",
        context: "Contribution empirique",
        value: "Validation sur 3 centres (Yaoundé, Douala, Garoua)",
        source: "Empirique p.172",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 174,
        paragraph: 1,
        type: "Donnée",
        context: "Résultats exceptionnels",
        value: "Performance dépasse benchmarks internationaux",
        source: "Comparaison p.174",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 175,
        paragraph: 1,
        type: "Donnée",
        context: "Vision stratégique",
        value: "Transformation numérique fiscale d'ici 2030",
        source: "Vision p.175",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 176,
        paragraph: 1,
        type: "Donnée",
        context: "Potentiel de replicabilité",
        value: "15 pays africains",
        source: "Généralisation p.176",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 176,
        paragraph: 2,
        type: "Donnée",
        context: "Technologies futures",
        value: "IA explicable, Blockchain, Edge computing",
        source: "Perspectives p.176",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 178,
        paragraph: 1,
        type: "Donnée",
        context: "Recommandations",
        value: "10 mesures prioritaires",
        source: "Recommandations p.178",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 178,
        paragraph: 2,
        type: "Donnée",
        context: "Plan déploiement",
        value: "36 mois, budget 450 milliards FCFA",
        source: "Déploiement p.178",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 179,
        paragraph: 1,
        type: "Donnée",
        context: "Formation agents",
        value: "2 000 agents, sensibilisation contribuables",
        source: "Accompagnement p.179",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 179,
        paragraph: 2,
        type: "Donnée",
        context: "Benchmarking",
        value: "8 solutions comparées internationalement",
        source: "Benchmark p.179",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 181,
        paragraph: 1,
        type: "Donnée",
        context: "Solutions comparées",
        value: "Estonie, Rwanda, Singapour vs solution Cameroun",
        source: "Comparaison p.181",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 181,
        paragraph: 2,
        type: "Donnée",
        context: "Avantage concurrentiel",
        value: "Coût réduit de 40% vs solutions importées",
        source: "Coûts p.181",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 182,
        paragraph: 1,
        type: "Donnée",
        context: "Facteurs critiques de succès",
        value: "15 facteurs identifiés",
        source: "CSF p.182",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "CONCLUSION GÉNÉRALE",
    title: "CONCLUSIONS ET PERSPECTIVES",
    data: [
      {
        page: 196,
        paragraph: 1,
        type: "Donnée",
        context: "Contributions majeures",
        value: "6 contributions validées",
        source: "Synthèse p.196",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 196,
        paragraph: 2,
        type: "Donnée",
        context: "Amélioration globale",
        value: "62,6% des indicateurs clés",
        source: "Impact global p.196",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 197,
        paragraph: 1,
        type: "Donnée",
        context: "Détection fraude",
        value: "Précision: 97,2%, Rappel: 94,8%",
        source: "Résultats ML p.197",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 197,
        paragraph: 2,
        type: "Donnée",
        context: "Efficacité opérationnelle",
        value: "Détection +35%, Délais -67%",
        source: "Impacts opérationnels p.197",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 197,
        paragraph: 3,
        type: "Donnée",
        context: "Impact économique",
        value: "Gain: 12,5 milliards FCFA/an",
        source: "Économie p.197",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 197,
        paragraph: 4,
        type: "Donnée",
        context: "Validation empirique",
        value: "3 centres pilotes, 18 mois d'expérimentation",
        source: "Validation p.197",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 198,
        paragraph: 1,
        type: "Donnée",
        context: "Contribution méthodologique",
        value: "DSRM adaptée au contexte africain",
        source: "Méthodologie p.198",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 198,
        paragraph: 2,
        type: "Donnée",
        context: "Contribution technologique",
        value: "Architecture Lambda hybride optimisée",
        source: "Technologie p.198",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 199,
        paragraph: 1,
        type: "Donnée",
        context: "Limite généralisation",
        value: "3 centres sur 58 au Cameroun",
        source: "Limites p.199",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 199,
        paragraph: 2,
        type: "Donnée",
        context: "Limite temporelle",
        value: "Évaluation sur 18 mois seulement",
        source: "Limites p.199",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 199,
        paragraph: 3,
        type: "Donnée",
        context: "Perspective déploiement",
        value: "Extension à 15 centres d'ici 2026",
        source: "Perspectives p.199",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 200,
        paragraph: 1,
        type: "Donnée",
        context: "Recommandations politiques",
        value: "10 mesures prioritaires",
        source: "Recommandations p.200",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 200,
        paragraph: 2,
        type: "Donnée",
        context: "Impact développement",
        value: "Contribution aux ODD 8, 9, 16, 17",
        source: "ODD p.200",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 201,
        paragraph: 1,
        type: "Donnée",
        context: "Recherche future",
        value: "5 axes de recherche émergents",
        source: "Recherche future p.201",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: 201,
        paragraph: 2,
        type: "Donnée",
        context: "Conclusion finale",
        value: "Solution reproductible à l'échelle CEMAC/UEMOA",
        source: "Conclusion p.201",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
  {
    chapter: "ANNEXES",
    title: "DOCUMENTS ANNEXES (A à M)",
    data: [
      {
        page: "A1",
        paragraph: 1,
        type: "Document",
        context: "Spécifications techniques",
        value: "Architecture Lambda hybride générale",
        source: "Annexe A - Specs techniques",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "A2",
        paragraph: 1,
        type: "Document",
        context: "Algorithmes ML",
        value: "Détection fraude et mécanismes explicabilité",
        source: "Annexe A.2",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "A3",
        paragraph: 1,
        type: "Document",
        context: "Infrastructure",
        value: "Architecture matérielle, logiciels, sécurité",
        source: "Annexe A.3",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "A4",
        paragraph: 1,
        type: "Document",
        context: "APIs et Interfaces",
        value: "Architecture REST, interface web, intégrations",
        source: "Annexe A.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "B1",
        paragraph: 1,
        type: "Document",
        context: "Résultats expérimentaux",
        value: "Protocole et design expérimental",
        source: "Annexe B.1",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "B2",
        paragraph: 1,
        type: "Document",
        context: "Performance technique",
        value: "Évolution taux détection, délais, métriques",
        source: "Annexe B.2",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "B3",
        paragraph: 1,
        type: "Document",
        context: "Impact opérationnel",
        value: "Recettes, satisfaction, acceptation",
        source: "Annexe B.3",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "B4",
        paragraph: 1,
        type: "Document",
        context: "Analyse statistique",
        value: "Tests significativité, modélisation, robustesse",
        source: "Annexe B.4",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "B5",
        paragraph: 1,
        type: "Document",
        context: "Analyse qualitative",
        value: "Analyse thématique et observations",
        source: "Annexe B.5",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "B6",
        paragraph: 1,
        type: "Document",
        context: "Coût-bénéfice",
        value: "Investissements, bénéfices, ROI",
        source: "Annexe B.6",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "C1",
        paragraph: 1,
        type: "Document",
        context: "Questionnaires agents",
        value: "Pré et post-déploiement + attitude",
        source: "Annexe C.1",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "C2",
        paragraph: 1,
        type: "Document",
        context: "Guides d'entretien",
        value: "Agents fiscaux et responsables",
        source: "Annexe C.2",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "C3",
        paragraph: 1,
        type: "Document",
        context: "Satisfaction contribuables",
        value: "Questionnaires téléphonique et en ligne",
        source: "Annexe C.3",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "D1",
        paragraph: 1,
        type: "Document",
        context: "Sources de données",
        value: "Données DGI, SIGTAS, macro-économiques",
        source: "Annexe D.1",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "D2",
        paragraph: 1,
        type: "Document",
        context: "Méthodologie données",
        value: "Extraction, traitement, anonymisation, validation",
        source: "Annexe D.2",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "D3",
        paragraph: 1,
        type: "Document",
        context: "Analyse statistique",
        value: "Stats descriptives, distributions, corrélations",
        source: "Annexe D.3",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "E1",
        paragraph: 1,
        type: "Document",
        context: "Code Python",
        value: "Scripts extraction et nettoyage données",
        source: "Annexe E.1",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "E2",
        paragraph: 1,
        type: "Document",
        context: "Modèles ML",
        value: "XGBoost et API Flask prédiction",
        source: "Annexe E.2",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "E3",
        paragraph: 1,
        type: "Document",
        context: "Monitoring",
        value: "Performance model et système d'alertes",
        source: "Annexe E.3",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "F1",
        paragraph: 1,
        type: "Document",
        context: "Modèles mathématiques",
        value: "Régression logistique et XGBoost",
        source: "Annexe F.1",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "F2",
        paragraph: 1,
        type: "Document",
        context: "Métriques ML",
        value: "AUC-ROC, F1-Score, Précision, Rappel",
        source: "Annexe F.2",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "G1",
        paragraph: 1,
        type: "Document",
        context: "Algorithmes détection",
        value: "Détection fraude et explicabilité SHAP/LIME",
        source: "Annexe G",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "H1",
        paragraph: 1,
        type: "Document",
        context: "Pseudo-code",
        value: "Algorithmes détection et déploiement",
        source: "Annexe H",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "I1",
        paragraph: 1,
        type: "Document",
        context: "Architecture cloud AWS",
        value: "Infrastructure, identités, chiffrement",
        source: "Annexe I",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "J1",
        paragraph: 1,
        type: "Document",
        context: "Études de cas",
        value: "Sectoriels (BTP, Commerce) et régionales",
        source: "Annexe J",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "K1",
        paragraph: 1,
        type: "Document",
        context: "Documentation API",
        value: "Endpoints, schémas, authentification, erreurs",
        source: "Annexe K",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "L1",
        paragraph: 1,
        type: "Document",
        context: "Datasets",
        value: "Entraînement, test, synthétiques",
        source: "Annexe L",
        status: "pending",
        comment: "",
        comments: "",
      },
      {
        page: "M1",
        paragraph: 1,
        type: "Document",
        context: "Documents administratifs",
        value: "Autorisations DGI, partenariats, certifications",
        source: "Annexe M",
        status: "pending",
        comment: "",
        comments: "",
      },
    ],
  },
]

interface EditModalProps {
  isOpen: boolean
  item: DataItem | null
  itemKey: string
  onClose: () => void
  onSave: (updatedItem: DataItem, itemKey: string) => void
}

function EditModal({ isOpen, item, itemKey, onClose, onSave }: EditModalProps) {
  const [editedItem, setEditedItem] = useState<DataItem | null>(item)

  useEffect(() => {
    setEditedItem(item)
  }, [item])

  if (!isOpen || !editedItem) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-96 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Éditer élément</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">Valeur</label>
            <input
              type="text"
              value={editedItem.value}
              onChange={(e) => setEditedItem({ ...editedItem, value: e.target.value })}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Source</label>
            <input
              type="text"
              value={editedItem.source}
              onChange={(e) => setEditedItem({ ...editedItem, source: e.target.value })}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Commentaires</label>
            <textarea
              value={editedItem.comments}
              onChange={(e) => setEditedItem({ ...editedItem, comments: e.target.value })}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1 h-24"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={() => {
              onSave(editedItem, itemKey)
              onClose()
            }}
            className="bg-blue-900 text-white hover:bg-blue-800"
          >
            Enregistrer
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function ThesisValidationForm() {
  const [chapter, setChapter] = useState<string>("CHAPITRE 0")
  const [chapters, setChapters] = useState<ChapterData[]>([])
  const [currentChapterData, setCurrentChapterData] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [itemStatuses, setItemStatuses] = useState<Record<string, DataItem["status"]>>({})
  const [editingItem, setEditingItem] = useState<{ item: DataItem; key: string } | null>(null)
  const [editedData, setEditedData] = useState<Record<number, DataItem>>({})

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    page: 80,
    paragraph: 80,
    type: 100,
    context: 150,
    value: 200,
    source: 200,
    comments: 180,
    status: 100,
    actions: 300,
  })

  const resizingRef = useRef<{ column: string; startX: number; startWidth: number } | null>(null)

  // Load chapters list
  useEffect(() => {
    const loadChapters = async () => {
      try {
        const response = await fetch('/api/thesis')
        const chaptersList = await response.json()
        setChapters(chaptersList.map((ch: any) => ({ chapter: ch.chapter, title: ch.title, data: [] })))
      } catch (error) {
        console.error('Error loading chapters:', error)
        // Fallback to static data
        setChapters(THESIS_DATA)
      } finally {
        setLoading(false)
      }
    }
    loadChapters()
  }, [])

  // Load chapter data when chapter changes
  useEffect(() => {
    const loadChapterData = async () => {
      if (!chapter) return
      setLoading(true)
      try {
        const response = await fetch(`/api/thesis?chapter=${encodeURIComponent(chapter)}`)
        if (response.ok) {
          const data = await response.json()
          setCurrentChapterData(data)
        } else {
          // Fallback to static data
          const fallback = THESIS_DATA.find((ch) => ch.chapter === chapter)
          if (fallback) {
            setCurrentChapterData(fallback)
          }
        }
      } catch (error) {
        console.error('Error loading chapter data:', error)
        // Fallback to static data
        const fallback = THESIS_DATA.find((ch) => ch.chapter === chapter)
        if (fallback) {
          setCurrentChapterData(fallback)
        }
      } finally {
        setLoading(false)
      }
    }
    loadChapterData()
  }, [chapter])

  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault()
    resizingRef.current = {
      column: columnKey,
      startX: e.clientX,
      startWidth: columnWidths[columnKey],
    }
    document.body.style.cursor = "col-resize"
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return

      const diff = e.clientX - resizingRef.current.startX
      const newWidth = Math.max(50, resizingRef.current.startWidth + diff)
      setColumnWidths((prev) => ({
        ...prev,
        [resizingRef.current!.column]: newWidth,
      }))
    }

    const handleMouseUp = () => {
      resizingRef.current = null
      document.body.style.cursor = "auto"
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [columnWidths])

  const chapterList = useMemo(() => chapters.map((chap) => chap.chapter), [chapters])

  const handleValidate = (itemKey: string) => {
    setItemStatuses((prev) => ({
      ...prev,
      [itemKey]: "validated",
    }))
  }

  const handleCorrect = (itemKey: string) => {
    setItemStatuses((prev) => ({
      ...prev,
      [itemKey]: "corrected",
    }))
  }

  const handleDownload = (item: DataItem) => {
    const csv = `Page,Paragraph,Type,Context,Value,Source,Status\n${item.page},${item.paragraph},"${item.type}","${item.context}","${item.value}","${item.source}",${itemStatuses[`${item.page}-${item.paragraph}`] || item.status}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data-${item.page}-${item.paragraph}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleReset = (itemKey: string) => {
    setItemStatuses((prev) => {
      const newStatuses = { ...prev }
      delete newStatuses[itemKey]
      return newStatuses
    })
    // Find item by key to get its id
    const item = currentChapterData?.data.find((d) => `${d.page}-${d.paragraph}` === itemKey)
    if (item?.id) {
      setEditedData((prev) => {
        const newData = { ...prev }
        delete newData[item.id!]
        return newData
      })
    }
  }

  const handleEditSave = async (updatedItem: DataItem, itemId: number) => {
    try {
      const response = await fetch(`/api/thesis/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      const savedItem = await response.json()
      
      // Update local state
      setEditedData((prev) => ({
        ...prev,
        [itemId]: savedItem,
      }))

      // Refresh chapter data
      if (currentChapterData) {
        const updatedData = currentChapterData.data.map((item) =>
          item.id === itemId ? savedItem : item
        )
        setCurrentChapterData({ ...currentChapterData, data: updatedData })
      }
    } catch (error) {
      console.error('Error saving item:', error)
      throw error
    }
  }

  const handleCellUpdate = async (itemId: number, field: keyof DataItem, value: string) => {
    if (!currentChapterData) return

    const item = currentChapterData.data.find((d) => d.id === itemId)
    if (!item) return

    const updatedItem = { ...item, [field]: value }
    await handleEditSave(updatedItem, itemId)
  }

  const getItemStatus = (item: DataItem) => {
    if (item.id && editedData[item.id]) {
      return editedData[item.id].status
    }
    return item.status === "validé" ? "validated" : 
           item.status === "en attente" ? "pending" : 
           item.status || "pending"
  }

  const getDisplayItem = (item: DataItem) => {
    if (item.id && editedData[item.id]) {
      return editedData[item.id]
    }
    return item
  }

  return (
    <div className="space-y-4 p-4">
      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          item={editingItem.item}
          itemKey={editingItem.key}
          onClose={() => setEditingItem(null)}
          onSave={(updatedItem, itemKey) => {
            // Find item by key to get its id
            const item = currentChapterData?.data.find((d) => `${d.page}-${d.paragraph}` === itemKey)
            if (item?.id) {
              handleEditSave(updatedItem, item.id)
            }
          }}
        />
      )}

      <Tabs defaultValue={chapter} onValueChange={setChapter}>
        <div className="overflow-x-auto border-b border-slate-200">
          <TabsList className="grid grid-cols-12 w-full lg:w-auto lg:flex gap-1">
            {chapters.map((chap) => (
              <TabsTrigger key={chap.chapter} value={chap.chapter} className="text-xs whitespace-nowrap px-2 py-1">
                {chap.chapter.split(" ")[1] || chap.chapter}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {chapters.map((chap) => {
          const displayData = currentChapterData?.chapter === chap.chapter ? currentChapterData : 
            THESIS_DATA.find((ch) => ch.chapter === chap.chapter) || chap
          return (
          <TabsContent key={chap.chapter} value={chap.chapter}>
            <Card className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">{displayData.title}</h2>
              {loading && currentChapterData?.chapter === chap.chapter ? (
                <div className="text-center py-8">Chargement...</div>
              ) : displayData.data && displayData.data.length > 0 ? (
              <div className="overflow-x-auto border border-blue-900 rounded">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-900 hover:bg-blue-900">
                      <TableHead
                        style={{ width: `${columnWidths.page}px`, minWidth: "50px" }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold border-r border-blue-700 relative select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span>Page</span>
                          <div
                            onMouseDown={(e) => handleMouseDown(e, "page")}
                            className={`w-1.5 h-full cursor-col-resize transition-colors ${
                              resizingRef.current?.column === "page"
                                ? "bg-yellow-400"
                                : "bg-blue-700 hover:bg-yellow-400"
                            }`}
                          />
                        </div>
                      </TableHead>
                      <TableHead
                        style={{ width: `${columnWidths.paragraph}px`, minWidth: "50px" }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold border-r border-blue-700 relative select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span>Para.</span>
                          <div
                            onMouseDown={(e) => handleMouseDown(e, "paragraph")}
                            className={`w-1.5 h-full cursor-col-resize transition-colors ${
                              resizingRef.current?.column === "paragraph"
                                ? "bg-yellow-400"
                                : "bg-blue-700 hover:bg-yellow-400"
                            }`}
                          />
                        </div>
                      </TableHead>
                      <TableHead
                        style={{ width: `${columnWidths.type}px`, minWidth: "50px" }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold border-r border-blue-700 relative select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span>Type</span>
                          <div
                            onMouseDown={(e) => handleMouseDown(e, "type")}
                            className={`w-1.5 h-full cursor-col-resize transition-colors ${
                              resizingRef.current?.column === "type"
                                ? "bg-yellow-400"
                                : "bg-blue-700 hover:bg-yellow-400"
                            }`}
                          />
                        </div>
                      </TableHead>
                      <TableHead
                        style={{ width: `${columnWidths.context}px`, minWidth: "50px" }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold border-r border-blue-700 relative select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span>Contexte</span>
                          <div
                            onMouseDown={(e) => handleMouseDown(e, "context")}
                            className={`w-1.5 h-full cursor-col-resize transition-colors ${
                              resizingRef.current?.column === "context"
                                ? "bg-yellow-400"
                                : "bg-blue-700 hover:bg-yellow-400"
                            }`}
                          />
                        </div>
                      </TableHead>
                      <TableHead
                        style={{ width: `${columnWidths.value}px`, minWidth: "50px" }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold border-r border-blue-700 relative select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span>Valeur</span>
                          <div
                            onMouseDown={(e) => handleMouseDown(e, "value")}
                            className={`w-1.5 h-full cursor-col-resize transition-colors ${
                              resizingRef.current?.column === "value"
                                ? "bg-yellow-400"
                                : "bg-blue-700 hover:bg-yellow-400"
                            }`}
                          />
                        </div>
                      </TableHead>
                      <TableHead
                        style={{ width: `${columnWidths.source}px`, minWidth: "50px" }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold border-r border-blue-700 relative select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span>Sources</span>
                          <div
                            onMouseDown={(e) => handleMouseDown(e, "source")}
                            className={`w-1.5 h-full cursor-col-resize transition-colors ${
                              resizingRef.current?.column === "source"
                                ? "bg-yellow-400"
                                : "bg-blue-700 hover:bg-yellow-400"
                            }`}
                          />
                        </div>
                      </TableHead>
                      <TableHead
                        style={{ width: `${columnWidths.comments}px`, minWidth: "50px" }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold border-r border-blue-700 relative select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span>Commentaires</span>
                          <div
                            onMouseDown={(e) => handleMouseDown(e, "comments")}
                            className={`w-1.5 h-full cursor-col-resize transition-colors ${
                              resizingRef.current?.column === "comments"
                                ? "bg-yellow-400"
                                : "bg-blue-700 hover:bg-yellow-400"
                            }`}
                          />
                        </div>
                      </TableHead>
                      <TableHead
                        style={{ width: `${columnWidths.status}px`, minWidth: "50px" }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold border-r border-blue-700 relative select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span>Statut</span>
                          <div
                            onMouseDown={(e) => handleMouseDown(e, "status")}
                            className={`w-1.5 h-full cursor-col-resize transition-colors ${
                              resizingRef.current?.column === "status"
                                ? "bg-yellow-400"
                                : "bg-blue-700 hover:bg-yellow-400"
                            }`}
                          />
                        </div>
                      </TableHead>
                      <TableHead
                        style={{ width: `${columnWidths.actions}px` }}
                        className="bg-blue-900 text-white px-2 py-3 text-xs font-semibold"
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.data.map((item, idx) => {
                      const itemKey = `${item.page}-${item.paragraph}`
                      const currentStatus = getItemStatus(item)
                      const displayItem = getDisplayItem(item)
                      
                      if (!item.id) {
                        // If item doesn't have an id, we can't edit it (fallback data)
                        return (
                          <TableRow key={idx} className="hover:bg-slate-50">
                            <TableCell className="px-2 py-2 text-xs text-slate-500 italic border-r border-blue-100" colSpan={9}>
                              Données en chargement ou non disponibles...
                            </TableCell>
                          </TableRow>
                        )
                      }

                      const statusOptions = [
                        { value: "pending", label: "En attente" },
                        { value: "validated", label: "Validé" },
                        { value: "corrected", label: "Corrigé" },
                        { value: "validé", label: "Validé" },
                        { value: "en attente", label: "En attente" },
                      ]

                      return (
                        <TableRow key={idx} className="hover:bg-slate-50">
                          <TableCell
                            style={{ width: `${columnWidths.page}px`, minWidth: "50px" }}
                            className="px-2 py-2 text-xs text-slate-900 border-r border-blue-100"
                          >
                            <EditableCell
                              value={displayItem.page}
                              type="number"
                              onSave={async (value) => {
                                await handleCellUpdate(item.id!, "page", value)
                              }}
                              className="text-xs"
                            />
                          </TableCell>
                          <TableCell
                            style={{ width: `${columnWidths.paragraph}px`, minWidth: "50px" }}
                            className="px-2 py-2 text-xs text-slate-900 border-r border-blue-100"
                          >
                            <EditableCell
                              value={displayItem.paragraph}
                              type="text"
                              onSave={async (value) => {
                                await handleCellUpdate(item.id!, "paragraph", value)
                              }}
                              className="text-xs"
                            />
                          </TableCell>
                          <TableCell
                            style={{ width: `${columnWidths.type}px`, minWidth: "50px" }}
                            className="px-2 py-2 text-xs border-r border-blue-100"
                          >
                            <EditableCell
                              value={displayItem.type}
                              type="text"
                              onSave={async (value) => {
                                await handleCellUpdate(item.id!, "type", value)
                              }}
                              className="text-xs"
                            />
                          </TableCell>
                          <TableCell
                            style={{ width: `${columnWidths.context}px`, minWidth: "50px" }}
                            className="px-2 py-2 text-xs text-slate-900 font-medium border-r border-blue-100"
                          >
                            <EditableCell
                              value={displayItem.context}
                              type="text"
                              onSave={async (value) => {
                                await handleCellUpdate(item.id!, "context", value)
                              }}
                              className="text-xs"
                            />
                          </TableCell>
                          <TableCell
                            style={{ width: `${columnWidths.value}px`, minWidth: "50px" }}
                            className="px-2 py-2 text-xs text-slate-700 border-r border-blue-100 break-words"
                          >
                            <EditableCell
                              value={displayItem.value || ""}
                              type="textarea"
                              onSave={async (value) => {
                                await handleCellUpdate(item.id!, "value", value)
                              }}
                              className="text-xs"
                            />
                          </TableCell>
                          <TableCell
                            style={{ width: `${columnWidths.source}px`, minWidth: "50px" }}
                            className="px-2 py-2 text-xs border-r border-blue-100 break-words"
                          >
                            <EditableCell
                              value={displayItem.source || ""}
                              type="textarea"
                              onSave={async (value) => {
                                await handleCellUpdate(item.id!, "source", value)
                              }}
                              className="text-xs"
                            />
                          </TableCell>
                          <TableCell
                            style={{ width: `${columnWidths.comments}px`, minWidth: "50px" }}
                            className="px-2 py-2 text-xs border-r border-blue-100 break-words"
                          >
                            <EditableCell
                              value={displayItem.comments || displayItem.comment || ""}
                              type="textarea"
                              onSave={async (value) => {
                                await handleCellUpdate(item.id!, "comments", value)
                                // Also update comment field for compatibility
                                if (displayItem.comment !== undefined) {
                                  await handleCellUpdate(item.id!, "comment", value)
                                }
                              }}
                              className="text-xs"
                            />
                          </TableCell>
                          <TableCell
                            style={{ width: `${columnWidths.status}px`, minWidth: "50px" }}
                            className="px-2 py-2 text-xs font-medium border-r border-blue-100"
                          >
                            <EditableCell
                              value={currentStatus}
                              type="select"
                              options={statusOptions}
                              onSave={async (value) => {
                                await handleCellUpdate(item.id!, "status", value)
                              }}
                              renderValue={(val) => {
                                const statusStr = String(val)
                                const statusLabel = statusOptions.find(opt => opt.value === statusStr)?.label || statusStr
                                const statusClass = 
                                  statusStr === "validated" || statusStr === "validé"
                                    ? "bg-green-100 text-green-800"
                                    : statusStr === "corrected" || statusStr === "corrigé"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-slate-100 text-slate-800"
                                return (
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
                                    {statusLabel}
                                  </span>
                                )
                              }}
                              className="text-xs"
                            />
                          </TableCell>
                          <TableCell
                            style={{ width: `${columnWidths.actions}px` }}
                            className="px-2 py-2 text-xs space-x-1 flex flex-wrap gap-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(displayItem)}
                              title="Télécharger"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReset(itemKey)}
                              title="Réinitialiser"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleValidate(itemKey)}
                              title="Valider"
                              className={currentStatus === "validated" ? "bg-green-100 border-green-300" : ""}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCorrect(itemKey)}
                              title="Corriger"
                              className={currentStatus === "corrected" ? "bg-orange-100 border-orange-300" : ""}
                            >
                              <AlertCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingItem({ item: displayItem, key: itemKey })}
                              title="Éditer"
                            >
                              <Pencil2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              ) : (
                <div className="text-center py-8 text-slate-500">Aucune donnée disponible</div>
              )}
            </Card>
          </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
