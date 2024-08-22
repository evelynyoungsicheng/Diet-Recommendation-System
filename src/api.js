// api.js
import axios from 'axios';

const apiUrl = 'http://localhost:5000'; // URL of the Python server

const fetchRecommendations = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/recommendations`, data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

export default fetchRecommendations;

const sendRequest = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/recommendations`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default sendRequest;