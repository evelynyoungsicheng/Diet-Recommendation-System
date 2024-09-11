import React, { useState, useRef } from 'react';
import './App.css'; // Import the CSS file
import axios from 'axios';

function App() {
  const [recommendations, setRecommendations] = useState({});
  const [region, setRegion] = useState('');
  const [diabetesType, setDiabetesType] = useState('');
  const [gender, setGender] = useState('');
  const [userId, setUserId] = useState('');
  const [preferences, setPreferences] = useState({
    lactose_free: true,
    low_carb: false,
    vegetarian: false,
    region: 'South-South',
  });

  const resultsRef = useRef(null); // Creates a reference to the results element


  const handleSubmit = async(event) => {
    event.preventDefault();

    // Update the preferences state with the selected region
    setPreferences((prev) => ({ ...prev, region: region }));



    // Construct the preferences object
    const updatedPreferences = {
      lactose_free: preferences.lactose_free,
      low_carb: preferences.low_carb,
      vegetarian: preferences.vegetarian,
      region: preferences.region
    };

    try {
      const response = await axios.post(
        'http://localhost:5001/recommend',
        {
          user_id: 1,
          preferences:  updatedPreferences
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );    
  
      if (response.statusText = 'OK') {
        const data = await response.data;
        setRecommendations(data);

        // Scroll to the results element
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

  return (
    <div>
      <h1>Diet Recommender System For Diabetics</h1>
      <form onSubmit={handleSubmit}>

        <div className='first'>
          <div>
            <label>User ID:  </label>
            <input 
              name='userId'
              type="text" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
            />
          </div>

          <div className='region'>
            <label>Choose Region: </label>
            <select name='region' value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Select Region</option>
              <option value="All regions">All Regions</option>
              <option value="Southwest">SouthWest</option>
              <option value="Southeast">SouthEast</option>
              <option value="South-South">South-South</option>
              <option value="Northwest">NorthWest</option>
              <option value="Northeast">NorthEast</option>
              <option value="North Central">North Central</option>
            </select>
          </div>
        </div>

        <div>
          <label>Gender: </label>
          <input
            type="radio"
            name="Gender"
            value="Male"
            onChange={() => setGender('Male')}
          />
          Male 
          <input
            type="radio"
            name="Gender"
            value="Female"
            onChange={() => setGender('Female')}
          />
          Female
          
        </div>

        <div>
          <label>Type of Diabetes: </label>
          <input
            type="radio"
            name="diabetesType"
            value="Type1"
            onChange={() => setDiabetesType('Type1')}
          />
          Type 1 
          <input
            type="radio"
            name="diabetesType"
            value="Type2"
            onChange={() => setDiabetesType('Type2')}
          />
          Type 2
          <input
            type="radio"
            name="diabetesType"
            value="Gestational"
            onChange={() => setDiabetesType('Gestational')}
          />
          Gestational
          
        </div>

        <div>
          <label>Preferences: </label>
          <input
            name='lactose_free'
            type="checkbox"
            checked={preferences.lactose_free}
            onChange={() =>
              setPreferences((prev) => ({ ...prev, lactose_free: !prev.lactose_free }))
            }
          />
          Lactose Free
          <input
            name='low_carb'
            type="checkbox"
            checked={preferences.lowCarb}
            onChange={() =>
              setPreferences((prev) => ({ ...prev, lowCarb: !prev.lowCarb }))
            }
          />
          Low Carb
          <input
            name='vegetarian'
            type="checkbox"
            checked={preferences.vegetarian}
            onChange={() =>
              setPreferences((prev) => ({ ...prev, vegetarian: !prev.vegetarian }))
            }
          />
          Vegetarian
          
        </div>
        <button type="submit">Get Recommendations</button>
      </form>


      <div className="recommendations" ref={resultsRef}>
        {recommendations && (
          <div>
            <h2>Your Meal Recommendations for Today</h2>
            <div className="meal-recommendations">
              {recommendations.Breakfast && (
                <div className="meal-column">
                  <h3>Breakfast</h3>
                  <p>{recommendations.Breakfast[0][0]}: {recommendations.Breakfast[0][1]}</p>
                </div>
              )}
              {recommendations.Lunch && (
                <div className="meal-column">
                  <h3>Lunch</h3>
                  <p>{recommendations.Lunch[0][0]}: {recommendations.Lunch[0][1]}</p>
                </div>
              )}
              {recommendations.Dinner && (
                <div className="meal-column">
                  <h3>Dinner</h3>
                  <p>{recommendations.Dinner[0][0]}: {recommendations.Dinner[0][1]}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

