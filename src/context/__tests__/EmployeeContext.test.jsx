import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmployeeProvider } from '../EmployeeContext';
import { useEmployees } from '../EmployeeContext';
import { describe, test, expect } from 'vitest';

const TestComponent = () => {
  const { employees, addEmployee } = useEmployees();

  React.useEffect(() => {
    addEmployee({ firstName: 'John', lastName: 'Doe' });
  }, [addEmployee]);

  return (
    <>
      <div data-testid="employee-count">{employees.length}</div>
      <div data-testid="employee-name">
        {employees[0]?.firstName} {employees[0]?.lastName}
      </div>
    </>
  );
};

describe('EmployeeContext', () => {
  test('should add an employee and make it available in context', async () => {
    render(
      <EmployeeProvider> 
        <TestComponent />
      </EmployeeProvider>
    );
// findByText() est asynchone : il attend que l'élement apparaisse dans le DOM avant de faire l'assertion 
//   
    expect(await screen.findByText('1')).toBeTruthy();
    expect(screen.getByTestId('employee-name').textContent).toBe('John Doe');
  });
});