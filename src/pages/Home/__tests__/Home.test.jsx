// src/pages/Home/__tests__/Home.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';
import Home from '../index';
import { EmployeeProvider } from '../../../context/EmployeeContext';

// Mock du composant Modal pour test
vi.mock('@rogue06/react-modal', () => ({
    default: ({ children, isOpen }) =>
      isOpen ? (
        <div data-testid="modal">
          <p>{children}</p>
        </div>
      ) : null
  }));


// Test du composant Home
describe('Home Component', () => {
  test('Afficher le formulaire / should render the form correctly', () => {
    render(
      <BrowserRouter>
        <EmployeeProvider>
          <Home />
        </EmployeeProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    // Vérifiez d'autres éléments du formulaire
  });

  test('soumet le formulaire / should show modal when form is submitted successfully', async () => {
    render(
      <BrowserRouter>
        <EmployeeProvider>
          <Home />
        </EmployeeProvider>
      </BrowserRouter>
    );
    
    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('First Name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText('Last Name'), { 
      target: { value: 'Doe' } 
    });
    fireEvent.change(screen.getByLabelText('Date of Birth'), {
        target: { value: '2025-01-01' }
    });
    fireEvent.change(screen.getByLabelText('Start Date'), {
        target: { value: '2025-01-01' }
    });
    fireEvent.change(screen.getByLabelText('Street'), {
        target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByLabelText('City'), {
        target: { value: 'Anytown' }
    }); 
    // Sélectionner un state
    const stateSelect = screen.getByLabelText('State');
    userEvent.click(stateSelect);
    const stateOption = await screen.findByText('California');
    userEvent.click(stateOption);
    // Remplir le code postal
    fireEvent.change(screen.getByLabelText('Zip Code'), {
        target: { value: '12345' }
    });
    // Sélectionner un départment
   const deptSelect = screen.getByLabelText('Department');  
   userEvent.click(deptSelect);
   const deptOption = await screen.findByText('Engineering');
   userEvent.click(deptOption);

    // Soumettre le formulaire
    fireEvent.click(screen.getByText('Save'));

    // Vérifier que la modal s'affiche
    expect(await screen.getByTestId('modal')).toBeInTheDocument();
    expect(within(screen.getByTestId('modal')).getByText('Employee Created!')).toBeInTheDocument();
  });
});