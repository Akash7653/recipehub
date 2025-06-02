import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecipeForm from './pages/RecipeForm';
import RecipeView from './pages/RecipeView';
import RecipeEdit from './pages/RecipeEdit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipe/new" element={<RecipeForm />} />
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/recipe/edit/:id" element={<RecipeEdit />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;