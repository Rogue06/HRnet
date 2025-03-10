import React, { createContext, useState, useEffect, useContext } from 'react';

// Étape 1: Création du contexte
// C'est comme créer une "boîte" vide qui pourra contenir des données
const EmployeeContext = createContext();

// Étape 2: Création du Provider (fournisseur de données)
// C'est un composant qui va "emballer" notre application et fournir les données à tous les composants enfants
export const EmployeeProvider = ({ children }) => {
  // State local pour stocker les employés
  const [employees, setEmployees] = useState([]);

  // À l'initialisation, on récupère les employés du localStorage (s'il y en a)
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  // Fonction pour ajouter un nouvel employé
  const addEmployee = (employee) => {
    // On crée une nouvelle liste avec tous les employés existants + le nouveau
    const newEmployees = [...employees, employee];
    // On met à jour le state
    setEmployees(newEmployees);
    // On sauvegarde dans localStorage
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  // On fournit les données et fonctions que l'on veut rendre disponibles
  const value = {
    employees,     // La liste des employés
    addEmployee    // La fonction pour ajouter un employé
  };

  // Le Provider "emballe" les enfants et leur fournit les données via la prop "value"
  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

// Étape 3: Création d'un Hook personnalisé pour faciliter l'utilisation du contexte
// C'est une fonction qui permet d'accéder facilement aux données du contexte
export const useEmployees = () => {
  // On utilise le hook useContext pour accéder au contexte
  const context = useContext(EmployeeContext);
  
  // Si on essaie d'utiliser ce hook en dehors d'un Provider, on affiche une erreur
  if (context === undefined) {
    throw new Error('useEmployees doit être utilisé avec un EmployeeProvider');
  }
  
  // On retourne les données du contexte
  return context;
}; 