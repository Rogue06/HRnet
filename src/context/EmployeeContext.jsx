import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { mockEmployees, generateMockEmployees } from '../data/mockEmployees';

// Étape 1: Création du contexte
// C'est comme créer une "boîte" vide qui pourra contenir des données
const EmployeeContext = createContext();

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

// Étape 2: Création du Provider (fournisseur de données)
// C'est un composant qui va "emballer" notre application et fournir les données à tous les composants enfants
export const EmployeeProvider = ({ children }) => {
  // State local pour stocker les employés
  const [employees, setEmployees] = useState([]);
  // État de chargement pour indiquer que les données sont en cours de récupération
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les employés depuis le localStorage de manière optimisée
  const loadEmployees = useCallback(() => {
    setLoading(true);
    
    // Utilisation de setTimeout pour ne pas bloquer le thread principal
    setTimeout(() => {
      try {
        const storedEmployees = localStorage.getItem('employees');
        if (storedEmployees) {
          setEmployees(JSON.parse(storedEmployees));
        } else {
          // Si aucune donnée n'existe, utiliser les données fictives
          setEmployees(mockEmployees);
          localStorage.setItem('employees', JSON.stringify(mockEmployees));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des employés:', error);
        // En cas d'erreur, utiliser les données fictives
        setEmployees(mockEmployees);
      } finally {
        setLoading(false);
      }
    }, 0);
  }, []);

  // À l'initialisation, on récupère les employés du localStorage (s'il y en a)
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Fonction pour ajouter un nouvel employé
  const addEmployee = (employee) => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const updatedEmployees = [...employees, employee];
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un employé:', error);
      } finally {
        setLoading(false);
      }
    }, 0);
    
    return true;
  };

  // Fonction pour réinitialiser aux données fictives (utile pour les tests)
  const resetToMockData = () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        // Générer de nouvelles données mockées pour éviter les références
        const freshMockData = generateMockEmployees(50);
        setEmployees(freshMockData);
        localStorage.setItem('employees', JSON.stringify(freshMockData));
      } catch (error) {
        console.error('Erreur lors de la réinitialisation des données:', error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  // On fournit les données et fonctions que l'on veut rendre disponibles
  const value = {
    employees,     // La liste des employés
    loading,       // État de chargement
    addEmployee,   // La fonction pour ajouter un employé
    resetToMockData, // La fonction pour réinitialiser aux données fictives
    refresh: loadEmployees // Fonction pour recharger les données
  };

  // Le Provider "emballe" les enfants et leur fournit les données via la prop "value"
  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider; 