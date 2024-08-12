from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity

# Initialize the Flask app
app = Flask(__name__)

# Load data
df_foods = pd.read_csv("./csvs/Project - food.csv")
df_preferences = pd.read_csv("./csvs/Project - User.csv")
df_ratings = pd.read_csv("./csvs/Project - ratings.csv")

# Preprocess data
df_ratings['like'] = df_ratings['rating'].apply(lambda x: 1 if x >= 3 else 0)
df_features = df_ratings.merge(df_foods, on='food_id').merge(df_preferences, on='user_id')

# Features to use
features = ['lactose_free', 'low_carb_y', 'vegetarian_y', 'region', 'meal_type']
X = df_features[features]
y = df_features['like']

# One-hot encode non-numeric columns
non_numeric_columns = X.select_dtypes(exclude=['number']).columns
encoder = OneHotEncoder(handle_unknown='ignore')
X_encoded = pd.DataFrame(encoder.fit_transform(X[non_numeric_columns]).toarray())

# Final feature set
X_final = pd.concat([X.drop(non_numeric_columns, axis=1), X_encoded], axis=1)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_final, y, test_size=0.2, random_state=42)

# Train the model
model = LogisticRegression()
model.fit(X_train, y_train)

# Create a user-item matrix
user_item_matrix = df_ratings.pivot(index='user_id', columns='food_id', values='rating').fillna(0)

# Calculate cosine similarity between items
item_similarity = cosine_similarity(user_item_matrix.T)
item_similarity_df = pd.DataFrame(item_similarity, index=user_item_matrix.columns, columns=user_item_matrix.columns)

# Function to make recommendations
def recommend(user_id, preferences, n_recommendations=1):
    lactose_free = preferences.get('lactose_free', None)
    low_carb = preferences.get('low_carb', None)
    vegetarian = preferences.get('vegetarian', None)
    region = preferences.get('region', None)

    filtered_foods = df_foods.copy()
    if lactose_free is not None:
        filtered_foods = filtered_foods[filtered_foods['lactose_free'] == lactose_free]
    if low_carb is not None:
        filtered_foods = filtered_foods[filtered_foods['low_carb'] == low_carb]
    if vegetarian is not None:
        filtered_foods = filtered_foods[filtered_foods['vegetarian'] == vegetarian]
    if region is not None:
        filtered_foods = filtered_foods[filtered_foods['region'] == region]

    user_ratings = user_item_matrix.loc[user_id]
    rated_items = user_ratings[user_ratings > 0].index.tolist()

    scores = item_similarity_df[rated_items].dot(user_ratings[rated_items]).div(item_similarity_df[rated_items].sum(axis=1))

    recommendations = {}
    for meal_type in ['Breakfast', 'Lunch', 'Dinner']:
        meal_type_items = filtered_foods[filtered_foods['meal_type'] == meal_type]['food_id'].tolist()
        meal_type_scores = scores[scores.index.isin(meal_type_items)]
        if not meal_type_scores.empty:
            top_items = meal_type_scores.nlargest(n_recommendations).index.tolist()
            recommendations[meal_type] = [[df_foods.loc[df_foods['food_id'] == item, 'name'].values[0],
                                          df_foods.loc[df_foods['food_id'] == item, 'full_description'].values[0]]
                                          for item in top_items]
        else:
            recommendations[meal_type] = 'Null'

    return recommendations

# API endpoint to get recommendations
@app.route('/recommend', methods=['POST'])
def get_recommendation():
    data = request.json
    user_id = data.get('user_id')
    preferences = data.get('preferences', {})
    recommendations = recommend(user_id, preferences)
    return jsonify(recommendations)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
