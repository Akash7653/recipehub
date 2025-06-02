import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function RecipeEdit() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState(1);
  const [tags, setTags] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState([{ text: '', timer: '' }]);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'recipes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDescription(data.description);
        setServings(data.servings);
        setTags(data.tags.join(', '));
        setIngredients(data.ingredients);
        setSteps(data.steps);
        setIsPublic(data.isPublic);
      }
    };
    fetchRecipe();
  }, [id]);

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
      const docRef = doc(db, 'recipes', id);
      await updateDoc(docRef, {
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
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error('Error updating recipe:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 mb-4">Edit Recipe</h1>
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
            className="form-control"
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
            <div key={index} className="row mb-2">
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
          <button type="button" className="btn btn-outline-primary" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
        </div>
        <div className="mb-3">
          <label className="form-label">Steps</label>
          {steps.map((step, index) => (
            <div key={index} className="row mb-2">
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
          <button type="button" className="btn btn-outline-primary" onClick={handleAddStep}>
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
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default RecipeEdit;