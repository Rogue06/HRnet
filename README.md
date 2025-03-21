# HRnet - Conversion d'une application jQuery vers React

![HRnet Logo](https://img.shields.io/badge/HRnet-React-61DAFB)

## Description

HRnet est une application web interne pour la gestion des employés. Ce projet représente la conversion d'une application jQuery vers une application moderne basée sur React, avec pour objectif d'améliorer les performances, la maintenabilité et l'expérience utilisateur.

## Améliorations apportées

### 1. Remplacement des plugins jQuery par des composants React

| Plugins jQuery    | Remplacé par                                                                      |
| ----------------- | --------------------------------------------------------------------------------- |
| jQuery Modal      | [@rogue06/react-modal](https://github.com/Rogue06/react-modal) (custom component) |
| jQuery DataTables | [@tanstack/react-table](https://tanstack.com/table/latest)                        |
| jQuery DatePicker | [React DatePicker](https://reactdatepicker.com/)                                  |
| jQuery Select     | [React Select](https://react-select.com/)                                         |

### 2. Développement d'un composant Modal personnalisé

L'un des objectifs majeurs était de convertir le plugin jQuery Modal en un composant React réutilisable. Pour cela, j'ai :

- Développé un composant Modal en React
- Publié ce composant sur GitHub Package sous le nom `@rogue06/react-modal`
- Ajouté des fonctionnalités d'animation et d'accessibilité

### 3. Améliorations de performance et UX

- **Optimisation des performances** : Réduction significative des temps de chargement et d'interaction
- **Interface utilisateur moderne** : Design responsive et esthétique
- **Amélioration de l'accessibilité** : Support du clavier, attributs ARIA
- **Fonctionnalités avancées** :
  - Tri des données sur toutes les colonnes
  - Filtrage global des données
  - Pagination améliorée

## Installation et démarrage

```bash
# Cloner le projet
git clone https://github.com/Rogue06/hrnet.git
cd hrnet

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev
```

## Structure du projet

```
HRnet/
├── public/           # Ressources statiques
│   └── README.md
├── src/
│   ├── components/   # Composants réutilisables
│   ├── context/      # Contextes React (EmployeeContext, etc.)
│   ├── data/         # Données statiques (états, départements, etc.)
│   ├── pages/        # Composants de page
│   │   ├── Home/     # Page de création d'employé
│   │   └── EmployeeList/ # Page de liste des employés
│   ├── styles/       # Styles globaux
│   ├── utils/        # Fonctions utilitaires
│   ├── App.jsx       # Composant principal
│   ├── main.jsx      # Point d'entrée
├── package.json
├── vite.config.js
└── README.md
```

## Performances

Des tests de performance ont été menés pour comparer l'application jQuery originale avec la nouvelle version React :

| Métrique                 | jQuery Original | Version React | Amélioration              |
| ------------------------ | --------------- | ------------- | ------------------------- |
| First Contentful Paint   | ~2.5s           | ~0.6s         | 76% plus rapide           |
| Largest Contentful Paint | ~3.8s           | ~0.6s         | 84% plus rapide           |
| Total Blocking Time      | Non disponible  | 0ms           | Performance optimale      |
| Cumulative Layout Shift  | 0.25            | 0.007         | Réduction de 97%          |
| Speed Index              | ~3.5s           | 0.6s          | 83% plus rapide           |
| Score Performance        | ~67             | 100           | Augmentation de 33 points |

Pour la page de liste des employés, les performances sont également exceptionnelles avec un score de 100/100, un First Contentful Paint de 0.5s et un Largest Contentful Paint de 0.5s.

## Captures d'écran

<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
  <div style="width: 48%;">
    <p><strong>Page de création d'employé</strong></p>
    <img src="screenshots/create-employee.png" alt="Create Employee Page" style="width: 100%;" />
  </div>
  <div style="width: 48%;">
    <p><strong>Page de liste des employés</strong></p>
    <img src="screenshots/employee-list.png" alt="Employee List Page" style="width: 100%;" />
  </div>
</div>

## Technologies utilisées

- React 18
- Vite
- React Router
- React Context API
- TanStack React Table (anciennement React Table)
- React Select
- React DatePicker
- Webpack (pour le packaging du composant Modal)

## Contributeurs

- [Rogue06](https://github.com/Rogue06)

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus d'informations.
