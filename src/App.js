import React, { useState } from 'react';
import './App.css'; // Import the CSS file
import axios from 'axios';

function App() {
  const [recommendations, setRecommendations] = useState({});
  const [location, setLocation] = useState('');
  const [diabetesType, setDiabetesType] = useState('');
  const [gender, setGender] = useState('');
  const [userId, setUserId] = useState('');
  const [preferences, setPreferences] = useState({
    lactoseIntolerant: true,
    lowCarb: null,
    vegetarian: null,
    region: location
  });

  const handleSubmit = async(event) => {
    event.preventDefault();

    // Construct the preferences object
    const updatedPreferences = {
      lactose_free: preferences.lactoseIntolerant,
      low_carb: preferences.lowCarb,
      vegetarian: preferences.vegetarian,
      region: preferences.region
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/recommend',
        {
          user_id: 1,
          preferences: {
            updatedPreferences
          }
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
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Diabetes-Diet Recommendation System</h1>
      <form onSubmit={handleSubmit}>

        <div className='first'>
          <div>
            <label>User ID:</label>
            <input 
              type="text" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
            />
          </div>

          <div className='location'>
            <label>Choose Location:</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="Northwest">NorthWest</option>
              <option value="Northeast">NorthEast</option>
              <option value="Northcentral">North Central</option>
              <option value="Southwest">SouthWest</option>
              <option value="Southeast">SouthEast</option>
              <option value="Southsouth">South-South</option>
            </select>
          </div>
        </div>

        <div>
          <label>Gender:</label>
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
          <label>Type of Diabetes:</label>
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
          <label>Preferences:</label>
          <input
            type="checkbox"
            checked={preferences.lactoseIntolerant}
            onChange={() =>
              setPreferences((prev) => ({ ...prev, lactoseIntolerant: !prev.lactoseIntolerant }))
            }
          />
          Lactose Intolerant
          <input
            type="checkbox"
            checked={preferences.lowCarb}
            onChange={() =>
              setPreferences((prev) => ({ ...prev, lowCarb: !prev.lowCarb }))
            }
          />
          Low Carb
          <input
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

      <div style={{ color: "black", backgroundColor: "white" }}>
      {recommendations && (
        <div>
          <h2>Meal Recommendations</h2>
          {recommendations.Breakfast && (
            <div>
              <h3>Breakfast</h3>
              <p>{recommendations.Breakfast[0][0]}: {recommendations.Breakfast[0][1]}</p>
            </div>
          )}
          {recommendations.Lunch && (
            <div>
              <h3>Lunch</h3>
              <p>{recommendations.Lunch[0][0]}: {recommendations.Lunch[0][1]}</p>
            </div>
          )}
          {recommendations.Dinner && (
            <div>
              <h3>Dinner</h3>
              <p>{recommendations.Dinner[0][0]}: {recommendations.Dinner[0][1]}</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default App;

