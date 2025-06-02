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
      <div className="container mt-5 px-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h1 className="display-4 fs-2">RecipeHub Dashboard</h1>
          <button className="btn btn-outline-danger mt-2 mt-md-0" onClick={handleLogout}>Logout</button>
        </div>
        <button className="btn btn-primary mb-4 w-100 w-md-auto" onClick={() => navigate('/recipe/new')}>
          Create New Recipe
        </button>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {recipes.length === 0 ? (
            <p className="text-muted fs-5">No recipes yet. Create one!</p>
          ) : (
            recipes.map(recipe => (
              <div key={recipe.id} className="col">
                <div className="card shadow-sm rounded h-100">
                  <div className="card-body">
                    <h5 className="card-title fs-5">{recipe.title}</h5>
                    <p className="card-text text-muted">{recipe.description}</p>
                    <button
                      className="btn btn-outline-primary w-100"
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