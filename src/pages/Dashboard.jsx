import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Navbar from '../components/Navbar';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (currentUser) {
        const q = query(collection(db, 'recipes'), where('isPublic', '==', true));
        const userRecipes = query(collection(db, 'recipes'), where('owner', '==', currentUser.uid));
        const [publicSnapshot, userSnapshot] = await Promise.all([getDocs(q), getDocs(userRecipes)]);
        const allRecipes = [
          ...publicSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          ...userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        ];
        setRecipes([...new Set(allRecipes.map(r => r.id))].map(id => allRecipes.find(r => r.id === id)));
      }
    };
    fetchRecipes();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-4">RecipeHub Dashboard</h1>
          <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
        </div>
        <button className="btn btn-primary mb-4" onClick={() => navigate('/recipe/new')}>
          Create New Recipe
        </button>
        <div className="row">
          {recipes.length === 0 ? (
            <p className="text-muted">No recipes yet. Create one!</p>
          ) : (
            recipes.map(recipe => (
              <div key={recipe.id} className="col-md-4 mb-3">
                <div className="card shadow-sm rounded">
                  <div className="card-body">
                    <h5 className="card-title">{recipe.title}</h5>
                    <p className="card-text text-muted">{recipe.description}</p>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;