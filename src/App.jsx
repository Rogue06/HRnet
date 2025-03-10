import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EmployeeList from './pages/EmployeeList';
import { EmployeeProvider } from './context/EmployeeContext';
import './App.css';

function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee-list" element={<EmployeeList />} />
        </Routes>
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;
