// RecommendationForm.js
import React, { useState } from 'react';
import fetchRecommendations from './apifetch';

const RecommendationForm = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [location, setLocation] = useState('');
  const [diabetesType, setDiabetesType] = useState('');
  const [gender, setGender] = useState('');
  const [userId, setUserId] = useState('');
  const [sendRequest, setSendRequest] = useState('');
  const [preferences, setPreferences] = useState({
    lactoseIntolerant: false,
    lowCarb: false,
    vegetarian: false,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchRecommendations({
        location,
        diabetesType,
        gender,
        userId,
        preferences,
      });
      const recommendations = response.data;
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Location:</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="northwest">NorthWest</option>
          <option value="northeast">NorthEast</option>
          <option value="northcentral">North Central</option>
          <option value="southwest">SouthWest</option>
          <option value="southeast">SouthEast</option>
          <option value="southsouth">South-South</option>
        </select>
      </div>
      <div>
        <label>Diabetes Type:</label>
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
        <label>Gender:</label>
        <input
          type="radio"
          name="gender"
          value="Male"
          onChange={() => setGender('Male')}
        />
        Male
        <input
          type="radio"
          name="gender"
          value="Female"
          onChange={() => setGender('Female')}
        />
        Female
      </div>
      <div>
        <label>User ID:</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
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
    
  );
};

export default RecommendationForm;