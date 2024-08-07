// api.js
import axios from 'axios';

const fetchRecommendations = async (userData) => {
  try {
    const response = await axios.post('http://127.0.0.1:5500/', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};

export default fetchRecommendations;