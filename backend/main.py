from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Impulse Risk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

class TransactionInput(BaseModel):
    time_gap: float
    spend_deviation: float
    hour: int
    is_weekend: int
    late_night: int

@app.post("/predict")
def predict(data: TransactionInput):

    features = np.array([[
        data.time_gap,
        data.spend_deviation,
        data.hour,
        data.is_weekend,
        data.late_night
    ]])

    scaled = scaler.transform(features)
    probability = model.predict_proba(scaled)[0][1]

    return {
        "impulse_probability": round(float(probability * 100), 2)
    }