# Impulse Intelligence Engine

A real-time behavioral financial risk scoring framework that detects impulse-driven purchase vulnerability using transactional compression and contextual signals.

## Overview

Impulse Intelligence Engine models behavioral risk in financial transactions by analyzing:

- Time gap compression
- Abnormal spending deviation
- Circadian vulnerability (late-night patterns)
- Weekend behavioral shifts

The system outputs a calibrated impulse risk score (0–100%) designed for fintech and digital banking integration.

## Architecture

Frontend:
- React + Tailwind CSS
- Interactive behavioral simulator
- Dynamic risk visualization

Backend:
- FastAPI
- Logistic Regression (class-balanced)
- StandardScaler preprocessing
- Real-time inference endpoint

## Model Performance

- ROC-AUC ≈ 0.80
- Accuracy ≈ 92%
- Probabilistic output scoring

## Tech Stack

- Python
- FastAPI
- Scikit-learn
- React
- Tailwind CSS

## Run Backend

cd backend  
uvicorn main:app --reload  

## Run Frontend

cd frontend  
npm install  
npm start