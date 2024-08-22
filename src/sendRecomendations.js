import React, { useState, useEffect } from 'react';

const RecommendComponent = () => {
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await fetch('/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: 1,
            preferences: {
              lactose_free: true,
              low_carb: null,
              vegetarian: null,
              region: "Southwest",
            },
          }),
        });

        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    postData();
  }, []);

  return (
    <div>
      <h1>Meal Recommendations</h1>
      {recommendations ? (
        <div>
          <h2>Breakfast</h2>
          <p>{recommendations.Breakfast[0][0]}: {recommendations.Breakfast[0][1]}</p>

          <h2>Lunch</h2>
          <p>{recommendations.Lunch[0][0]}: {recommendations.Lunch[0][1]}</p>

          <h2>Dinner</h2>
          <p>{recommendations.Dinner[0][0]}: {recommendations.Dinner[0][1]}</p>
        </div>
      ) : (
        <p>Loading recommendations...</p>
      )}
    </div>
  );
};

export default RecommendComponent;
