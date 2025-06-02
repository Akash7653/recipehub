import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

function RecipeForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState(1);
  const [tags, setTags] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState([{ text: '', timer: '' }]);
  const [isPublic, setIsPublic] = useState(true);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, { text: '', timer: '' }]);
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        description,
        servings: Number(servings),
        tags: tags.split(',').map(tag => tag.trim()),
        ingredients,
        steps,
        isPublic,
        owner: currentUser.uid,
        collaborators: [currentUser.email]
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert('Failed to save recipe: ' + err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5 px-3">
        <h1 className="display-4 fs-2 mb-4">Create Recipe</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Servings</label>
            <input
              type="number"
              className="form-control w-50 w-md-25"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="row row-cols-1 row-cols-md-3 g-2 mb-2">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary w-100 w-md-auto" onClick={handleAddIngredient}>
              Add Ingredient
            </button>
          </div>
          <div className="mb-3">
            <label className="form-label">Steps</label>
            {steps.map((step, index) => (
              <div key={index} className="row row-cols-1 row-cols-md-2 g-2 mb-2">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Step description"
                    value={step.text}
                    onChange={(e) => handleStepChange(index, 'text', e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Timer (minutes)"
                    value={step.timer}
                    onChange={(e) => handleStepChange(index, 'timer', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary w-100 w-md-auto" onClick={handleAddStep}>
              Add Step
            </button>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label className="form-check-label">Public Recipe</label>
          </div>
          <button type="submit" className="btn btn-primary w-100 w-md-auto">Save Recipe</button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;