import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

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

  // Fetch Recipe on Mount
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

  // Recalculate ingredients on serving change
  useEffect(() => {
    if (recipe && newServings !== recipe.servings) {
      const scaleFactor = newServings / recipe.servings;
      const updatedIngredients = recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        quantity: (parseFloat(ingredient.quantity) * scaleFactor).toFixed(2),
      }));
      setScaledIngredients(updatedIngredients);
    }
  }, [newServings, recipe]);

  // Handle Timer Countdown
  useEffect(() => {
    let timer;
    if (activeTimer !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
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

  // Start Timer
  const startTimer = (index, minutes) => {
    setActiveTimer(index);
    setTimeLeft(minutes * 60);
  };

  // Add Collaborator
  const addCollaborator = async () => {
    if (!collaboratorEmail.trim()) return;

    try {
      const docRef = doc(db, 'recipes', id);
      const newCollaborators = Array.from(new Set([...(recipe.collaborators || []), collaboratorEmail.trim()]));
      await updateDoc(docRef, { collaborators: newCollaborators });
      setRecipe((prev) => ({ ...prev, collaborators: newCollaborators }));
      setCollaboratorEmail('');
      alert('Collaborator added!');
    } catch (err) {
      console.error('Error adding collaborator:', err);
      alert('Failed to add collaborator: ' + err.message);
    }
  };

  // Sync Recipe From Firestore
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

  // Check Access
  const isOwnerOrCollaborator =
    currentUser &&
    (recipe?.owner === currentUser.uid || (recipe?.collaborators || []).includes(currentUser.email));

  if (!recipe) return <div className="container mt-5">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container mt-5 px-3">
        <h1 className="display-4 fs-2 mb-4">{recipe.title}</h1>
        <p className="lead">{recipe.description}</p>
        <p className="fs-5"><strong>Tags:</strong> {recipe.tags?.join(', ')}</p>
        <p className="fs-5"><strong>Original Servings:</strong> {recipe.servings}</p>

        <div className="mb-3">
          <label className="form-label">Adjust Servings:</label>
          <input
            type="number"
            className="form-control w-100 w-md-25"
            value={newServings}
            onChange={(e) => setNewServings(Number(e.target.value))}
            min="1"
          />
        </div>

        <h3 className="fs-4">Ingredients</h3>
        <ul className="list-group mb-4">
          {scaledIngredients.map((ingredient, index) => (
            <li key={index} className="list-group-item">
              {ingredient.name}: {ingredient.quantity} {ingredient.unit}
            </li>
          ))}
        </ul>

        <h3 className="fs-4">Steps</h3>
        <ol className="list-group list-group-numbered">
          {recipe.steps.map((step, index) => (
            <li
              key={index}
              className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
            >
              <span>{step.text} {step.timer && <span>({step.timer} min)</span>}</span>
              {step.timer && (
                <button
                  className="btn btn-outline-success btn-sm mt-2 mt-md-0"
                  onClick={() => startTimer(index, step.timer)}
                  disabled={activeTimer !== null}
                >
                  {activeTimer === index
                    ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                    : 'Start Timer'}
                </button>
              )}
            </li>
          ))}
        </ol>

        {isOwnerOrCollaborator && (
          <>
            <div className="mt-4">
              <h3 className="fs-4">Add Collaborator</h3>
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

            <div className="d-flex flex-column flex-md-row gap-2 mt-2">
              <button className="btn btn-outline-primary w-100 w-md-auto" onClick={syncRecipe}>
                Sync Changes
              </button>
              <button
                className="btn btn-primary w-100 w-md-auto"
                onClick={() => navigate(`/recipe/edit/${id}`)}
              >
                Edit Recipe
              </button>
            </div>
          </>
        )}

        <button
          className="btn btn-secondary mt-4 w-100 w-md-auto"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default RecipeView;
