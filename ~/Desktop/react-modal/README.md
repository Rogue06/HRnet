# React Modal Component

Un composant Modal (fenêtre de dialogue) simple, léger et personnalisable pour les applications React.

## Installation

```bash
npm install @rogue06/react-modal
```

## Utilisation

```jsx
import React, { useState } from "react";
import Modal from "@rogue06/react-modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Ouvrir la modal</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Titre de la modal</h2>
        <p>Contenu de la modal</p>
      </Modal>
    </div>
  );
}
```

## Props

| Prop       | Type     | Obligatoire | Description                                         |
| ---------- | -------- | ----------- | --------------------------------------------------- |
| `isOpen`   | boolean  | Oui         | Contrôle si la modal est visible ou non             |
| `onClose`  | function | Oui         | Fonction appelée quand l'utilisateur ferme la modal |
| `children` | node     | Non         | Contenu à afficher dans la modal                    |

## Fonctionnalités

- Fermeture par touche Echap
- Fermeture en cliquant à l'extérieur de la modal
- Animation fluide d'ouverture/fermeture
- Empêche le défilement du corps de la page quand la modal est ouverte
- Design responsive
- Personnalisable via CSS

## Compatibilité

Ce composant est compatible avec React 16.8.0 et versions supérieures.

## Licence

MIT
