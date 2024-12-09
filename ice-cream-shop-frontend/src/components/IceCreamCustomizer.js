import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/IceCreamCustomizer.css'
const IceCreamCustomizer = ({ username }) => {
    const [flavors, setFlavors] = useState([]); 
    const [ingredients, setIngredients] = useState([]); 
    const [selectedFlavor, setSelectedFlavor] = useState(''); 
    const [selectedIngredients, setSelectedIngredients] = useState([]); 
    const [totalPrice, setTotalPrice] = useState(0); 

    // Fetch available flavors and ingredients from the backend
    const fetchData = async () => {
        try {
            const [flavorsResponse, ingredientsResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/flavors'),
                axios.get('http://localhost:5000/api/ingredients'),
            ]);

            setFlavors(flavorsResponse.data);
            setIngredients(ingredientsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Handle flavor selection
    const handleFlavorChange = (event) => {
        setSelectedFlavor(event.target.value);
        calculateTotalPrice(event.target.value, selectedIngredients);
    };

    // Handle ingredient selection
    const handleIngredientChange = (ingredient, isChecked) => {
        let newSelectedIngredients = [...selectedIngredients];
    
        if (isChecked) {
            newSelectedIngredients.push(ingredient); 
        } else {
            newSelectedIngredients = newSelectedIngredients.filter((ing) => ing.id !== ingredient.id); 
        }
    
        setSelectedIngredients(newSelectedIngredients);
        calculateTotalPrice(selectedFlavor, newSelectedIngredients);
    };
    

    // Calculate total price based on selected flavor and ingredients
    const calculateTotalPrice = (flavor, ingredients) => {
        const flavorPrice = flavors.find((f) => f.name === flavor)?.price || 0;
        const ingredientsPrice = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
        setTotalPrice(flavorPrice + ingredientsPrice);
    };


    const handleOrder = () => {
        alert("Order placed: Custom-order!");
    
        setSelectedFlavor("");
        setSelectedIngredients([]);
        setTotalPrice(0);
      };
    

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h2>Customize Your Ice Cream</h2>

            {/* Flavor Selection */}
            <div className="flavor-selector">
                <h4>Select Flavor:</h4>
                {flavors.length === 0 ? (
                    <p>Loading flavors...</p>
                ) : (
                    <select value={selectedFlavor} onChange={handleFlavorChange}>
                        <option value="" disabled>
                            -- Select a Flavor --
                        </option>
                        {flavors.map((flavor) => (
                            <option key={flavor.id} value={flavor.name}>
                                {flavor.name} (RS: {flavor.price})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Ingredient Selection */}
            <div className="ingredient-selector">
                <h4>Select Ingredients:</h4>
                {ingredients.length === 0 ? (
                    <p>Loading ingredients...</p>
                ) : (
                    ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="ingredient-item">
                            <input
                                type="checkbox"
                                id={`ingredient-${ingredient.id}`}
                                onChange={(e) => handleIngredientChange(ingredient, e.target.checked)}
                            />
                            <label htmlFor={`ingredient-${ingredient.id}`}>
                                {ingredient.name} (RS: {ingredient.price})
                            </label>
                        </div>
                    ))
                )}
            </div>

            {/* Total Price and Place Order Button */}
            <h4>Total Price: RS {totalPrice}</h4>
            <button onClick={handleOrder} disabled={!selectedFlavor || selectedIngredients.length === 0}>
                Place Order
            </button>
        </div>
    );
};

export default IceCreamCustomizer;
