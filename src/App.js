import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TrolleyList from './components/TrolleyList';
import TrolleyDetails from './components/TrolleyDetails';
import TrolleyForm from './components/TrolleyForm';
import Login from './components/Login';
import ProtectRout from './Utility/ProtectRout';
import ProtectedRoutHook from './auth/ProtectedRoutHook';
import AdminComponent from './components/admin/AdminComponent';
import "bootstrap/dist/css/bootstrap.min.css"
import initFontAwesome from './Utility/initFontAwesome';

 
initFontAwesome();
function App() {
  const [isUser, isAdmin ,isManager] = ProtectedRoutHook();

 

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectRout auth={isUser || isAdmin  || isManager} />}>
        <Route path="/trolleys" element={<TrolleyList />} />
        <Route path="/trolleys/:id" element={<TrolleyDetails />} />
        <Route path="/add-trolley" element={<TrolleyForm />} />
      </Route>
      <Route element={<ProtectRout auth={isAdmin || isManager } />}>
        <Route path="/admin" element={<AdminComponent />} />
        
      </Route>
    </Routes>
  );
}

export default App;
