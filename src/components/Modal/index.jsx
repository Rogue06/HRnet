import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Composant Modal
 * @param {object} props - Les propriétés du composant
 * @param {boolean} props.isOpen - État d'ouverture de la modal
 * @param {function} props.onClose - Fonction appelée à la fermeture
 * @param {React.ReactNode} props.children - Contenu de la modal
 * @returns {React.ReactElement} - Élément React
 */
const Modal = ({ isOpen, onClose, children }) => {
  // Empêche le défilement du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Nettoyage lors du démontage du composant
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Gestion de la touche Echap pour fermer la modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Ferme la modal si on clique à l'extérieur
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal; 