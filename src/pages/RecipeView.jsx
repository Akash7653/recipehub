import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function RecipeView() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [newServings, setNewServings] = useState(0);
  const [scaledIngredients, setScaledIngredients] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'recipes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecipe({ id: docSnap.id, ...data });
        setNewServings(data.servings);
        setScaledIngredients(data.ingredients);
      } else {
        navigate('/dashboard');
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  useEffect(() => {
    if (recipe && newServings !== recipe.servings) {
      const scaleFactor = newServings / recipe.servings;
      const updatedIngredients = recipe.ingredients.map(ingredient => ({
        ...ingredient,
        quantity: (parseFloat(ingredient.quantity) * scaleFactor).toFixed(2)
      }));
      setScaledIngredients(updatedIngredients);
    }
  }, [newServings, recipe]);

  useEffect(() => {
    let timer;
    if (activeTimer !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            new Audio('https://www.soundjay.com/buttons/beep-01a.mp3').play();
            alert(`Step ${activeTimer + 1} timer finished!`);
            setActiveTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTimer, timeLeft]);

  const startTimer = (index, minutes) => {
    if (typeof minutes !== 'number' || isNaN(minutes)) return;
    setActiveTimer(index);
    setTimeLeft(minutes * 60);
  };

  const addCollaborator = async () => {
    if (!collaboratorEmail) return;
    try {
      const docRef = doc(db, 'recipes', id);
      const newCollaborators = [...(recipe.collaborators || []), collaboratorEmail];
      await updateDoc(docRef, { collaborators: newCollaborators });
      setRecipe({ ...recipe, collaborators: newCollaborators });
      setCollaboratorEmail('');
      alert('Collaborator added!');
    } catch (err) {
      console.error('Error adding collaborator:', err);
      alert('Failed to add collaborator: ' + err.message);
    }
  };

  const syncRecipe = async () => {
    const docRef = doc(db, 'recipes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setRecipe({ id: docSnap.id, ...data });
      setNewServings(data.servings);
      setScaledIngredients(data.ingredients);
    }
  };

  if (!recipe) {
    return <div className="container mt-5">Loading...</div>;
  }

  const isOwnerOrCollaborator = currentUser &&
    (recipe.owner === currentUser.uid || (recipe.collaborators || []).includes(currentUser.email));

  return (
    <div className="container mt-5">
      <h1 className="display-4 mb-4">{recipe.title}</h1>
      <p className="lead">{recipe.description}</p>
      <p><strong>Tags:</strong> {recipe.tags?.join(', ')}</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>

      <div className="mb-3">
        <label className="form-label">Adjust Servings:</label>
        <input
          type="number"
          className="form-control w-25"
          value={newServings}
          onChange={(e) => setNewServings(Number(e.target.value))}
          min="1"
        />
      </div>

      <h3>Ingredients</h3>
      <ul className="list-group mb-4">
        {scaledIngredients.map((ingredient, index) => (
          <li key={index} className="list-group-item">
            {ingredient.name}: {ingredient.quantity} {ingredient.unit}
          </li>
        ))}
      </ul>

      <h3>Steps</h3>
      <ol className="list-group list-group-numbered">
        {recipe.steps.map((step, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {step.text} {step.timer && <span>({step.timer} min)</span>}
            </span>
            {step.timer && (
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => startTimer(index, step.timer)}
                disabled={activeTimer !== null}
              >
                {activeTimer === index && timeLeft !== null
                  ? `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`
                  : 'Start Timer'}
              </button>
            )}
          </li>
        ))}
      </ol>

      {isOwnerOrCollaborator && (
        <>
          <div className="mt-4">
            <h3>Add Collaborator</h3>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Collaborator email"
                value={collaboratorEmail}
                onChange={(e) => setCollaboratorEmail(e.target.value)}
              />
              <button className="btn btn-primary" onClick={addCollaborator}>
                Invite
              </button>
            </div>
          </div>

          <button className="btn btn-outline-primary mt-2" onClick={syncRecipe}>
            Sync Changes
          </button>

          <button
            className="btn btn-primary mt-3 ms-2"
            onClick={() => navigate(`/recipe/edit/${id}`)}
          >
            Edit Recipe
          </button>
        </>
      )}

      <button
        className="btn btn-secondary mt-3 ms-2"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default RecipeView;
