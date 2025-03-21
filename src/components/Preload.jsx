import { useEffect } from 'react';

/**
 * Composant de préchargement des ressources critiques
 * Améliore les performances perçues en préchargeant les ressources importantes
 */
const Preload = () => {
  useEffect(() => {
    // Précharger les composants et ressources pour les employés
    const preloadEmployeeComponents = () => {
      // Préchargement des modules importants
      const preloads = [
        // Préchargement des composants de la page Employee
        import('../pages/EmployeeList/components/TableFilters'),
        import('../pages/EmployeeList/components/TableActions'),
        import('../pages/EmployeeList/components/Pagination'),
        
        // Préchargement des données
        import('../data/mockEmployees')
      ];
      
      // Exécuter les préchargements de manière non bloquante
      Promise.all(preloads).catch(e => {
        // Ignorer les erreurs silencieusement, c'est juste une optimisation
        console.debug('Preloading resources failed:', e);
      });
    };
    
    // Utiliser requestIdleCallback si disponible, sinon setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadEmployeeComponents, { timeout: 2000 });
    } else {
      setTimeout(preloadEmployeeComponents, 1000);
    }
    
    return () => {
      // Nettoyer si nécessaire
      if ('requestIdleCallback' in window && window.cancelIdleCallback) {
        // Annulation si la callback n'a pas encore été exécutée
      }
    };
  }, []);
  
  // Ce composant ne rend rien visuellement
  return null;
};

export default Preload; 