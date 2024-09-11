from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity

# Initialize the Flask app
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'], methods=['POST', 'GET'], headers=['Content-Type'])
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), unique=True, nullable=False)
    preferences = db.Column(db.String(200), nullable=False)
    recommendations = db.Column(db.String(200), nullable=True)


# Load data
df_foods = pd.read_csv("./csvs/Project - food.csv")
df_preferences = pd.read_csv("./csvs/Project - User.csv")
df_ratings = pd.read_csv("./csvs/Project - ratings.csv")



# Create a user-item matrix
user_item_matrix = df_ratings.pivot(index='user_id', columns='food_id', values='rating').fillna(0)

# Calculate cosine similarity between items
item_similarity = cosine_similarity(user_item_matrix.T)
item_similarity_df = pd.DataFrame(item_similarity, index=user_item_matrix.columns, columns=user_item_matrix.columns)

# Function to make recommendations
def recommend(user_id, preferences, n_recommendations=1):
    lactose_free = preferences.get('lactose_free', None)
    lowCarb = preferences.get('lowCarb', None)
    vegetarian = preferences.get('vegetarian', None)
    region = preferences.get('region', None)

    filtered_foods = df_foods.copy()
    if lactose_free is not None:
        filtered_foods = filtered_foods[filtered_foods['lactose_free'] == lactose_free]
    if lowCarb is not None:
        filtered_foods = filtered_foods[filtered_foods['lowCarb'] == lowCarb]
    if vegetarian is not None:
        filtered_foods = filtered_foods[filtered_foods['vegetarian'] == vegetarian]
    if region is not None and 'region' in df_foods.columns:
        filtered_foods = filtered_foods[filtered_foods['region'] == region]

    user_ratings = user_item_matrix.loc[user_id]
    rated_items = user_ratings[user_ratings >= 0].index.tolist()

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


@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    print("Request Data: ")
    print(data)
    user_id = data['user_id']
    preferences = data['preferences']
    n_recommendations = data.get('n_recommendations', 1)
    recommendations = recommend(user_id, preferences, n_recommendations)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
