import pickle
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score

# Generate synthetic dataset for fraud detection
X, y = make_classification(
    n_samples=1000,
    n_features=20,
    n_informative=10,
    n_redundant=5,
    n_clusters_per_class=2,
    weights=[0.95, 0.05],  # imbalanced dataset
    flip_y=0.01,
    random_state=42,
)

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Train logistic regression model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Evaluate the model
preds = model.predict(X_test)
probs = model.predict_proba(X_test)[:, 1]
print("Classification Report:\n", classification_report(y_test, preds))
print("ROC AUC:", roc_auc_score(y_test, probs))

# Save the model
with open("fraud_model.pkl", "wb") as f:
    pickle.dump(model, f)
    print("Model saved to fraud_model.pkl")
